/**
 * Copyright (c) 2008-2015 Regents of the University of California (Regents).
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
package org.wise.portal.presentation.web.controllers.admin;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;
import org.wise.portal.domain.user.User;
import org.wise.portal.presentation.web.controllers.ControllerUtil;
import org.wise.portal.service.user.UserService;

/**
 * Controller for retrieving disabled WISE accounts and for enabling and disabling WISE user accounts.
 * Only accessed by a WISE admin user.
 * @author Hiroki Terashima
 */
@Controller
@RequestMapping("/admin/account/enabledisableuser")
public class EnableDisableUserController {

  @Autowired
  private UserService userService;

  /**
   * Check to see if the user to enable/disable has already been enabled/disabled. If yes, return such message.
   * @see org.springframework.web.servlet.mvc.AbstractController#handleRequestInternal(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
   */
  @RequestMapping(method = RequestMethod.GET)
  protected String handleGET(ModelMap modelMap) throws Exception {
    // retrieve a list of already-disabled user accounts.
    List<User> disabledUsers = userService.retrieveDisabledUsers();
    modelMap.put("disabledUsers", disabledUsers);
    return "/admin/account/enabledisableuser";
  }

  @RequestMapping(method = RequestMethod.POST)
  protected String handlePOST(HttpServletRequest request, HttpServletResponse response) throws Exception {
    // enable/disable user accounts
    String doEnable = request.getParameter("doEnable");
    String username = request.getParameter("username");
    User user = userService.retrieveUserByUsername(username);
    // check to see if user exists in the system.
    if (user != null) {
      if (Boolean.parseBoolean(doEnable)) {
        // enable the account
        if (!user.getUserDetails().isEnabled()) {
          user.getUserDetails().setEnabled(true);
          userService.updateUser(user);
          response.getWriter().write("success");
        } else {
          response.getWriter().write("User '"+username+"' is already enabled.");
        }
      } else {
        // disable the account
        if (user.getUserDetails().isEnabled()) {
          user.getUserDetails().setEnabled(false);
          userService.updateUser(user);
          response.getWriter().write("success");
        } else {
          response.getWriter().write("User '"+username+"' is already disabled.");
        }
      }
    } else {
      // user does not exist in the system.
      response.getWriter().write("User '" + username + "' was not found in the system. Please check the spelling and try again.");
    }
    return null;
  }

  /**
   * @param userService the userService to set
   */
  public void setUserService(UserService userService) {
    this.userService = userService;
  }
}
