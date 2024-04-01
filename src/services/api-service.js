const serverUrl = "http://localhost:8449";

const apis = {
  account: serverUrl + "/api/account/",
  user: serverUrl + "/api/user/",
  manager: serverUrl + "/api/manager/",
  admin: serverUrl + "/api/admin/",
  healthObjectiveManagement: serverUrl + "/api/health_objective-management/",
  organisation: serverUrl + "/api/organisation/",
  healthRecommendationManagement:
    serverUrl + "/api/health_recommendation-management/",
  healthProgress: serverUrl + "/api/health_progress/",
  healthRecordManagement: serverUrl + "/api/health_record-management/",
  device: serverUrl + "/api/device-management/",
  chat: serverUrl + "/api/chat/",
};

export default apis;
