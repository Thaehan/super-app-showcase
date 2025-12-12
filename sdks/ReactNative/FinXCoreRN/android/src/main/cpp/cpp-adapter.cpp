#include <jni.h>
#include "finxcorernOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::finxcorern::initialize(vm);
}
