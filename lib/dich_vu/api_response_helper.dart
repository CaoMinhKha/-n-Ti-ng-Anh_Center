class ApiResponseHelper {
  static List<dynamic> parseListResponse(dynamic payload) {
    if (payload is List) {
      return payload;
    }

    if (payload is Map<String, dynamic>) {
      final data = payload['data'];
      if (data is List) {
        return data;
      }
    }

    return [];
  }
}

List<dynamic> parseListResponse(dynamic payload) => ApiResponseHelper.parseListResponse(payload);
