/**
 * Copyright (c) 2008-2017 Regents of the University of California (Regents).
 * Created by WISE, Graduate School of Education, University of California, Berkeley.
 *
 * This software is distributed under the GNU General Public License, v3,
 * or (at your option) any later version.
 *
 * Permission is hereby granted, without written agreement and without license
 * or royalty fees, to use, copy, modify, and distribute this software and its
 * documentation for any purpose, provided that the above copyright notice and
 * the following two paragraphs appear in all copies of this software.
 *
 * REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE. THE SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED
 * HEREUNDER IS PROVIDED "AS IS". REGENTS HAS NO OBLIGATION TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 *
 * IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,
 * SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS,
 * ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * REGENTS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package org.wise.portal.dao.workgroup.impl;

import java.util.List;

import org.hibernate.FetchMode;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.wise.portal.dao.impl.AbstractHibernateDao;
import org.wise.portal.dao.workgroup.WorkgroupDao;
import org.wise.portal.domain.run.Run;
import org.wise.portal.domain.user.User;
import org.wise.portal.domain.workgroup.Workgroup;
import org.wise.portal.domain.workgroup.impl.WorkgroupImpl;

/**
 * @author Hiroki Terashima
 */
@Repository
public class HibernateWorkgroupDao extends AbstractHibernateDao<Workgroup>
    implements WorkgroupDao<Workgroup> {

  private static final String FIND_ALL_QUERY = "from WorkgroupImpl";

  /**
   * @see org.wise.portal.dao.impl.AbstractHibernateDao#getFindAllQuery()
   */
  @Override
  protected String getFindAllQuery() {
    return FIND_ALL_QUERY;
  }

  /**
   * @param run
   * @param user
   * @return
   */
  @SuppressWarnings("unchecked")
  public List<Workgroup> getListByRunAndUser(Run run, User user) {
    Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
    SQLQuery sqlQuery = session
      .createSQLQuery("SELECT w.*, g.* FROM workgroups as w, groups as g, "
        + "groups_related_to_users as g_r_u "
        + "WHERE w.group_fk = g.id "
        + "AND g_r_u.group_fk = w.group_fk "
        + "AND g_r_u.user_fk = :user_param "
        + "AND w.run_fk = :run_param ");

    sqlQuery.addEntity("workgroup", WorkgroupImpl.class);
    sqlQuery.setParameter("run_param", run.getId());
    sqlQuery.setParameter("user_param", user.getId());
    return sqlQuery.list();
  }

  /**
   * @param user
   * @return
   */
  @SuppressWarnings("unchecked")
  public List<Workgroup> getListByUser(User user) {
    Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();
    SQLQuery sqlQuery = session
      .createSQLQuery("SELECT w.*, g.* FROM workgroups as w, groups as g, "
        + "groups_related_to_users as g_r_u "
        + "WHERE w.group_fk = g.id "
        + "AND g_r_u.group_fk = w.group_fk "
        + "AND g_r_u.user_fk = :user_param ");
    sqlQuery.addEntity("workgroup", WorkgroupImpl.class);
    sqlQuery.setParameter("user_param", user.getId());
    return sqlQuery.list();
  }

  /**
   * @see org.wise.portal.dao.impl.AbstractHibernateDao#getDataObjectClass()
   */
  @Override
  protected Class<WorkgroupImpl> getDataObjectClass() {
    return WorkgroupImpl.class;
  }

  @Override
  @Transactional(readOnly = true)
  public WorkgroupImpl getById(Long workgroupId, boolean doEagerFetch) {
    Session session = this.getHibernateTemplate().getSessionFactory().getCurrentSession();

    WorkgroupImpl result;
    if (doEagerFetch) {
      result = (WorkgroupImpl) session.createCriteria(WorkgroupImpl.class)
        .add( Restrictions.eq("id", workgroupId))
        .setFetchMode("run", FetchMode.JOIN)
        .setFetchMode("group", FetchMode.JOIN)
        .setFetchMode("period", FetchMode.JOIN)
        .uniqueResult();
    } else {
      result = (WorkgroupImpl) session.createCriteria(WorkgroupImpl.class)
        .add( Restrictions.eq("id", workgroupId))
        .uniqueResult();
    }
    return result;
  }
}
