#!/usr/bin/env bash
# À lancer avec le téléphone branché en USB et le débogage USB activé.
# Puis ouvre l’app sur le téléphone : les lignes FATAL / AndroidRuntime s’affichent ici.
set -euo pipefail
adb devices
echo ">>> Nettoyage du buffer logcat, puis capture (Ctrl+C pour arrêter)..."
adb logcat -c
adb logcat -v time "AndroidRuntime:E" "ReactNative:V" "ReactNativeJS:V" "libc:F" "DEBUG:E" "*:S"
