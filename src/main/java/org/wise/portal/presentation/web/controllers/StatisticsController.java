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
package org.wise.portal.presentation.web.controllers;

import java.util.List;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.wise.portal.domain.portal.PortalStatistics;
import org.wise.portal.service.portal.PortalStatisticsService;
import org.wise.portal.service.vle.VLEService;
import org.wise.vle.domain.statistics.VLEStatistics;

/**
 * Controller for handling WISE statistics page
 *
 * @author Geoffrey Kwan
 */
@Controller
@RequestMapping("/pages/statistics.html")
public class StatisticsController {

  @Autowired
  private Properties wiseProperties;

  @Autowired
  private PortalStatisticsService portalStatisticsService;

  @Autowired
  private VLEService vleService;

  /**
   * Handle the request to the statistics page
   */
  @RequestMapping(method = RequestMethod.GET)
  protected ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response) throws Exception {
    String typeParam = request.getParameter("type");

    if ("portal".equals(typeParam)) {
      //Retrieve all the portal statistics and put them into a JSONArray
      //and then return the JSONArray as a string

      //get all the portal statistics ordered by timestamp from oldest to newest
      List<PortalStatistics> portalStatisticsList = portalStatisticsService.getPortalStatistics();

      //the array to store all the portal statistics in JSONObject form
      JSONArray portalStatisticsArray = new JSONArray();

      //loop through all the portal statistics
      for(int x=0; x<portalStatisticsList.size(); x++) {
        //get a portal statistics object
        PortalStatistics portalStatistics = portalStatisticsList.get(x);

        //get the JSONObject representation of the portal statistics
        JSONObject portalStatisticsJSONObject = portalStatistics.getJSONObject();

        //add it to our array
        portalStatisticsArray.put(portalStatisticsJSONObject);
      }

      //send back the JSONArray that contains all the portal statistics as a string
      response.getWriter().write(portalStatisticsArray.toString());

      return null;
    } else if ("vle".equals(typeParam)) {
      //get all the vle statistics
      List<VLEStatistics> vleStatisticsList = vleService.getVLEStatistics();

      //create a JSONArray to store all the vle statistics
      JSONArray vleStatisticsJSONArray = new JSONArray();

      //loop through all the vle statistics and put them into the array
      for(int x=0; x<vleStatisticsList.size(); x++) {
        VLEStatistics vleStatistics = vleStatisticsList.get(x);

        if(vleStatistics != null) {
          JSONObject vleStatisticsJSONObject = vleStatistics.getJSONObject();

          if(vleStatisticsJSONObject != null) {
            vleStatisticsJSONArray.put(vleStatisticsJSONObject);
          }
        }
      }

      //return the JSONArray in string form
      response.getWriter().write(vleStatisticsJSONArray.toString());

      return null;
    } else {
      ModelAndView modelAndView = new ModelAndView();
      return modelAndView;
    }
  }
}
