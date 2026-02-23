#include <jni.h>
#include "smobilecorernOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::smobilecorern::initialize(vm);
}
