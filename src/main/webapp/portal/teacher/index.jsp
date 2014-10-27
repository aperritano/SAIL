<%@ include file="../include.jsp"%>

<!DOCTYPE html>
<html lang="en">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="X-UA-Compatible" content="chrome=1" />

<link href="${contextPath}/<spring:theme code="globalstyles"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="stylesheet"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="teacherhomepagestylesheet" />" media="screen" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="${contextPath}/<spring:theme code="jquerysource"/>"></script> 
<script type="text/javascript" src="${contextPath}/<spring:theme code="jqueryuisource"/>"></script>
<script type="text/javascript" src="${contextPath}/<spring:theme code="jquerymigrate.js"/>"></script>
<script type="text/javascript" src="${contextPath}/<spring:theme code="jquerycookiesource"/>"></script>
<script type="text/javascript" src="${contextPath}/<spring:theme code="generalsource"/>"></script>
<script type="text/javascript" src="${contextPath}/<spring:theme code="browserdetectsource"/>"></script>

<title><spring:message code="teacher.index.wiseTeacherDashboard" /></title>

<!--NOTE: the following scripts has CONDITIONAL items that only apply to IE (MattFish)-->
<!--[if lt IE 7]>
<script defer type="text/javascript" src="../javascript/iefixes.js"></script>
<![endif]-->

<script type='text/javascript'>
var isTeacherIndex = true; //global var used by spawned pages (i.e. archive run)
</script>

</head>
    
<body>

<div id="pageWrapper">

	<%@ include file="../headermain.jsp"%>
	
	<div id="page">
		
		<div id="pageContent">
			<div class="sidebar sidebarLeft">
				<div class="sidePanel">
					<div class="panelHeader"><spring:message code="teacher.index.quickLinks" /></div>
					
					<div class="panelContent">
				
						<table id="teacherQuickLinks">
							<tr>
								<td><a href="${contextPath}/pages/gettingstarted.html" target="_blank"><spring:message code="teacher.index.quickstartGuide"/></a></td>
							</tr>
							<tr>
								<td><a href="${contextPath}/teacher/management/library.html"><spring:message code="teacher.index.browseWISEProjects"/></a></td>
							</tr>
							<tr>
								<td><a href="${contextPath}/teacher/management/classroomruns.html"><spring:message code="teacher.index.gradeAndManageClassroomRuns"/></a></td>
							</tr>
							<c:if test="${discourseSSOLoginURL != null}">
							   <tr>
							   	  <td><a target=_blank href="${discourseSSOLoginURL}"><spring:message code="wiseTeacherCommunity"/></a></td>
							   </tr>
                 			</c:if>
						</table>
					</div>
				</div>
				
				<div class='sidePanel'>
					<div class="panelHeader"><spring:message code="teacher.index.messages" /></div>
					
					<div class="panelContent">
			
						<table id="teacherMessageTable">
							<tr>
								<td>
								<div id="welcomeMsg" class="highlight welcomeMsg">
									<c:set var="current_date" value="<%=new java.util.Date()%>" />
									<c:choose>
										<c:when test="${(current_date.hours>=0) && (current_date.hours<12)}">
											<spring:message code="teacher.index.hopeHavingGoodMorning" />
										</c:when>
										<c:when test="${(current_date.hours>=12) && (current_date.hours<18)}">
											<spring:message code="teacher.index.goodAfternoon" />
										</c:when>
										<c:when test="${(current_date.hours>=18) && (current_date.hours<23)}">
											<spring:message code="teacher.index.goodEvening" />
										</c:when>
										<c:otherwise>
										</c:otherwise>
									</c:choose>
								</div>
								<div id="newsContent" class="highlight welcomeMsg">
									<c:forEach var="newsItem" items="${teacherOnlyNewsItems}">
										<div class="newsItem">
											<p class="newsTitle"><span class="newsDate"><fmt:formatDate value="${newsItem.date}" type="date" dateStyle="short" /></span>${newsItem.title}</p>
											<p class="newsSnippet">${newsItem.news}</p>
										</div>
									</c:forEach>
								</div>
								<ul class="reminders">
									<c:forEach var="run" items="${current_run_list1}">
										<sec:accesscontrollist domainObject="${run}" hasPermission="16">
											<c:if test='${(run.archiveReminderTime.time - current_date.time) < 0}'>
												<li><spring:message code="teacher.index.yourProjectRun" /> <span style="font-weight:bold;">${run.name} (${run.id})</span> <spring:message code="teacher.index.hasBeenOpenSince" />
													<fmt:formatDate value="${run.starttime}" type="date" dateStyle="medium" timeStyle="short" />.
													 <spring:message code="teacher.index.doYouWantToArchive" />  [<a class="runArchiveLink"
															id='archiveRun_${run.id}'><spring:message code="teacher.index.yes" /></a> / <a class="extendReminderLink" id='extendReminder_${run.id}'><spring:message code="teacher.index.remindMeLater" /></a>]</li>
											</c:if>
										</sec:accesscontrollist>
									</c:forEach>
								</ul>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
			
			<div class="contentPanel contentRight">
				<div class="panelHeader">
					<spring:message code="teacher.index.recentActivity" />
					<span class="pageTitle"><spring:message code="teacher.index.teacherHome"/></span>
				</div>
				
				<div class="panelContent">
					<%@ include file="run/recentactivity.jsp"%>
				</div>
				
				<c:if test="${discourseSSOLoginURL != null}">
				 <div id="discourseDiv" class="panelFooter" style="text-align:center; padding:10px; color:#745A33">
                    <span><spring:message code="wiseTeacherCommunity.questionsUsingWISE"/> <a target=_blank href="${discourseSSOLoginURL}"><spring:message code="wiseTeacherCommunity.askWISECommunity"/></a></span>
                 </div>
                 </c:if>

			</div>
		</div>
		<div style="clear: both;"></div>
	</div>   <!-- End of page -->
	
	<%@ include file="../footer.jsp"%>
</div>

<!-- Page-specific script TODO: Make text translatable and move to external script-->

<script type="text/javascript">
    /**
     * Asynchronously updates the run with the given id on the server and 
     * displays the appropriate reponse when completed.
     */
    $('.extendReminderLink').on('click',function(){
    	var link = $(this);
    	var id = $(this).attr('id').replace('extendReminder_','');
    	var updatingText = $('<span style="color: #DDCDB5;"> ' + '<spring:message code="teacher.index.updating"/>' + '</span>');
    	link.parent().append(updatingText);
    	$.ajax({
			type:"post",
			url: "${contextPath}/teacher/run/updateRun.html",
			data:{"command":"extendReminderTime","runId":id},
			success: function(request){
				updatingText.remove();
				link.css('text-decoration','strike-through');
				link.parent().append('<span style="color: #DDCDB5;"> ' + '<spring:message code="teacher.index.youWillBeReminded"/>' + ' ' + id + ' ' + '<spring:message code="teacher.index.in30Days"/>');
				setTimeout(function(){link.parent().fadeOut();},5000);
			},
			error: function(request,error){
				updatingText.remove();
				link.parent().append('<span style="color: #DD2424;"> ' + '<spring:message code="teacher.index.unableToUpdateRun"/> ' + id + ' ' + '<spring:message code="teacher.index.tryAgainLater"/>' + '</span>');
			}
       	});
       });

        /**
        * Asynchronously archives a run
        **/
        $('.runArchiveLink').on('click',function(){
        	var link = $(this);
        	var id = $(this).attr('id').replace('archiveRun_','');
        	var updatingText = $('<span style="color: #DDCDB5;"> ' + '<spring:message code="teacher.index.updating"/>' + '</span>');
        	link.parent().append(updatingText);
        	$.ajax({
				type:"post",
				url:"${contextPath}/teacher/run/manage/archiveRun.html",
				data: {"command":"archiveRun","runId":id},
				success: function(request){
					updatingText.remove();
					link.css('text-decoration','strike-through');
					link.parent().append('<span style="color: #DDCDB5;"> ' + '<spring:message code="teacher.index.projectRun"/>' + ' ' + id + ' ' + '<spring:message code="teacher.index.hasBeenArchivedWillRefresh"/>' + '</span>');
					setTimeout(function(){window.location.reload();},2000);
				},
				error: function(request,error){
					updatingText.remove();
					link.parent().append('<span style="color: #DD2424;"> ' + '<spring:message code="teacher.index.unableToArchiveRun"/>' + ' ' + id + ' ' + '<spring:message code="teacher.index.tryAgainLater"/>' + '</span>');
				}
        	});
        });

	/**
	 * Asynchronously archives a message
	 **/
	function archiveMessage(messageId, sender) {
		var messageDiv = $('#message_' + messageId);
		messageDiv.html('<spring:message code="teacher.index.archivingMessage"/>');

		$.ajax({
			type: 'post',
			url: '${contextPath}/message.html?action=archive&messageId='+messageId,
			success: function(request){
				/* update message on teacher index page announcements section */
				messageDiv.remove();
				$("#message_confirm_div_" + messageId).html('<span style="color: #24DD24;">' + '<spring:message code="teacher.index.messageFrom"/>' + ' ' + sender + ' ' + '<spring:message code="teacher.index.hasBeenArchived"/>' + '</span>');
				/* update count of new message in message count div */
				var messageCountDiv = $("#newMessageCount");
				var messages = $("#messageDiv");
				if (messages.length == 1) {
					messageCountDiv.html('<spring:message code="teacher.index.youHave"/>' + " " + messages.length + " " + '<spring:message code="teacher.index.newMessage"/>');
				} else {
					messageCountDiv.html('<spring:message code="teacher.index.youHave"/>' + " " + messages.length + " " + '<spring:message code="teacher.index.newMessage"/>');
				}
			},
			error: function(request,error){
				/* set failure message */
				messageDiv.html('<span style="color: #992244;">' + '<spring:message code="teacher.index.unableToArchiveMessage"/>' + '</span>');
			}
		});
    }
</script>
</body>
</html>
