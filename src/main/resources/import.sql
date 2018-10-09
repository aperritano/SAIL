
-- initial data for wise below

SET DATABASE REFERENTIAL INTEGRITY FALSE;

INSERT INTO granted_authorities VALUES (1,'ROLE_USER',0),(2,'ROLE_ADMINISTRATOR',0),(3,'ROLE_TEACHER',0),(4,'ROLE_STUDENT',0),(5,'ROLE_AUTHOR',0),(6,'ROLE_RESEARCHER',0),(7,'ROLE_TRUSTED_AUTHOR',0),(8,'ROLE_TRANSLATOR',0);

INSERT INTO portal (id,settings,projectLibraryGroups,projectMetadataSettings,run_survey_template,sendmail_on_exception,OPTLOCK) VALUES (1,'{isLoginAllowed:true}','[]','{"fields":[{"name":"Title","key":"title","type":"input"},{"name":"Summary","key":"summary","type":"textarea"},{"name":"Language","key":"language","type":"radio","choices":["English","Chinese (Simplified)","Chinese (Traditional)","Dutch","German","Greek","Hebrew","Japanese","Korean","Portuguese","Spanish","Thai","Turkish"]},{"name":"Subject","key":"subject","type":"radio","choices":["Life Science","Physical Science","Earth Science","General Science","Biology","Chemistry","Physics","Other"]},{"name":"Time Required to Complete Project","key":"time","type":"input"},{"name":"Supported Devices","key":"supportedDevices","type":"checkbox","choices":["PC","Tablet"]}],"i18n":{"lifeScience":{"en":"Life Science","ja":"ライフサイエンス"},"earthScience":{"en":"Earth Science","ja":"地球科学"},"physicalScience":{"en":"Physical Science","ja":"物理科学","es":"ciencia física"}}}','{"save_time":null,"items":[{"id":"recommendProjectToOtherTeachers","type":"radio","prompt":"How likely would you recommend this project to other teachers?","choices":[{"id":"5","text":"Extremely likely"},{"id":"4","text":"Very likely"},{"id":"3","text":"Moderately likely"},{"id":"2","text":"Slightly likely"},{"id":"1","text":"Not at all likely"}],"answer":null},{"id":"runProjectAgain","type":"radio","prompt":"How likely would you run this project again?","choices":[{"id":"5","text":"Extremely likely"},{"id":"4","text":"Very likely"},{"id":"3","text":"Moderately likely"},{"id":"2","text":"Slightly likely"},{"id":"1","text":"Not at all likely"}],"answer":null},{"id":"useWISEAgain","type":"radio","prompt":"How likely would you use WISE again in your classroom?","choices":[{"id":"5","text":"Extremely likely"},{"id":"4","text":"Very likely"},{"id":"3","text":"Moderately likely"},{"id":"2","text":"Slightly likely"},{"id":"1","text":"Not at all likely"}],"answer":null},{"id":"adviceForOtherTeachers","type":"textarea","prompt":"Please share any advice for other teachers about this project or about WISE in general.","answer":null},{"id":"technicalProblems","type":"textarea","prompt":"Please write about any technical problems that you had while running this project.","answer":null},{"id":"generalFeedback","type":"textarea","prompt":"Please provide any other feedback to WISE staff.","answer":null}]}',1,0);

INSERT INTO user_details (id, account_not_expired, account_not_locked, credentials_not_expired, email_address, enabled, language, password, username, OPTLOCK)  VALUES (1,1,1,1,NULL,1,'en','24c002f26c14d8e087ade986531c7b5d','admin',0),(2,1,1,1,NULL,1,'en','4cd92091d686b42ec74a29a26432915a','preview',0);

INSERT INTO users (id, OPTLOCK, user_details_fk) VALUES (1,0,1),(2,0,2);

INSERT INTO teacher_user_details (city,country,curriculumsubjects,displayname,isEmailValid,firstname,lastlogintime,lastname,numberoflogins,schoollevel,schoolname,signupdate,state,id) VALUES ('Berkeley','USA',NULL,'adminuser',0,'ad',NULL,'min',0,3,'Berkeley','2010-10-25 15:41:31','CA',1),('Berkeley','USA',NULL,'preview',0,'pre',NULL,'view',0,3,'Berkeley','2010-10-25 15:41:31','CA',2);

INSERT INTO user_details_related_to_roles VALUES (1,1),(1,2),(1,3),(1,5),(2,1),(2,3),(2,5);

INSERT INTO PROJECTS VALUES(1,'2017-10-06 15:48:51.525000',NULL,0,TRUE,FALSE,FALSE,NULL,'{"lastMinified":null,"keywords":null,"compTime":null,"subject":null,"language":null,"lastEdited":null,"title":"My Science Project","tools":{},"maxScores":null,"postLevel":null,"contact":null,"theme":null,"id":null,"summary":null,"totalTime":null,"techReqs":{},"author":null,"lessonPlan":null,"lastCleaned":null,"standards":null,"navMode":null,"versionId":null,"techDetailsString":"","gradeRange":null,"projectId":null}','/e2e-test1/project.json','My Science Project',NULL,4,0,5,NULL,1)

SET DATABASE REFERENTIAL INTEGRITY TRUE
