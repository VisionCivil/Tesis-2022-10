import 'package:firebase_storage/firebase_storage.dart' as firebase_storage;

class Storage {
  final firebase_storage.FirebaseStorage storage =
      firebase_storage.FirebaseStorage.instance;

  Future<firebase_storage.ListResult> listFiles() async {
    firebase_storage.ListResult results = await storage
        .ref("reports/9qtfhe3qLJgjJGYWvSPd/media/images")
        .listAll();
    results.items.forEach((firebase_storage.Reference ref) {
      print("file: $ref");
    });
    return results;
  }

  Future<List<String>> downloadUrl(
      List<String> imagesIds, String idReport) async {
    List<String> urls = [];
    for (var i = 0; i < imagesIds.length - 1; i++) {
      String downloadURL = await storage
          .ref("reports/" + idReport + "/media/images/" + imagesIds[i])
          .getDownloadURL();
      urls.add(downloadURL);
    }
    return urls;
  }

  Future<String> listVideoPath(String idReport, String idVideo) async {
    //List<String> urls = [];
    String downloadVideoURL = await storage
        .ref("reports/" + idReport + "/media/video/" + idVideo)
        .getDownloadURL();

    //urls.add(downloadURL);
    return downloadVideoURL;
  }
}
