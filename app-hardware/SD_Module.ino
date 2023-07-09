#include <SPI.h>
#include "FS.h"
#include "SD.h"

#define SD_CS_PIN 5

/// SD MODULE FUNCTIONS


String readFile(fs::FS& fs, const char* path) {
  Serial.printf("Reading file: %s\n", path);

  File file = fs.open(path);
  if (!file) {

    return;
  }

  String fileContent = "";
  while (file.available()) {
    char c = file.read();
    fileContent += c;
  }

  file.close();

  return fileContent;
}

void writeFile(fs::FS& fs, String path, String message) {
  File file = fs.open(path, FILE_WRITE);
  if (!file) {
    Serial.print("Error While");
    Serial.print("SD Writing! ");
    return;
  }
  if (file.print(message)) {
    Serial.print("SD Save Success");
  } else {
    Serial.print("SD Save failed");
  }
  file.close();
}

void deleteFile(fs::FS& fs, const char* path) {
  if (fs.remove(path)) {
    Serial.print("SD FILES Deleted");

  } else {
    Serial.print("SD FORMAT FAILED!");
  }
}

boolean createDir(fs::FS& fs, const char* path) {
  Serial.printf("Creating Dir: %s\n", path);
  if (fs.mkdir(path)) {
    Serial.println("Dir created");
    return true;
  } else {
    Serial.println("mkdir failed");
    return false;
  }
}

listDir(fs::FS& fs, const char* dirname, uint8_t levels) {

  Serial.printf("Listing directory: %s\n", dirname);

  File root = fs.open(dirname);
  if (!root) {
    Serial.println("Failed to open directory");
    return false;
  }
  if (!root.isDirectory()) {
    Serial.println("Not a directory");
    return false;
  }

  File file = root.openNextFile();
  while (file) {
    if (!file.isDirectory()) {
      Serial.println("Filename : ");
      Serial.print(file.name());
    }
    file = root.openNextFile();
  }
  return true;
}

void setup() {
  Serial.begin(115200);
  // put your setup code here, to run once:
  while (!SD.begin(SD_CS_PIN)) {
    Serial.println("Card Mount Failed");
    delay(3000);
  }



  writeFile(SD, attendanceRecordPath, "Content of the session 1 text file");

  int sessionID = 34;

  boolean result = createDir(SD, "/failed");
  while (!result) {
    result = createDir(SD, "/failed");
  }

  String attendanceRecordPath = "/failed/" + sessionID + ".txt";
  const char* savepath = attendanceRecordPath.c_str();

  writeFile(SD, savepath, "Content of the session file");

  listDir(SD,"/failed/",0);

  String fileContent = readFile(SD, savepath);

  Serial.println(fileContent);

  deleteFile(SD, savepath);
}

void loop() {
  
}
