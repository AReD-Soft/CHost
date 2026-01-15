#!/system/bin/sh
# post-fs-data.sh: bind-mount hosts overlay (legacy)

MODPATH=/data/adb/modules/chost
HOSTS_FILE=$MODPATH/system/etc/hosts
TARGET=/system/etc/hosts
LOG_DIR=/sdcard/chost
LOG_FILE=$LOG_DIR/host_bind.log

mkdir -p "$LOG_DIR"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
}

if [ -f "$HOSTS_FILE" ]; then
    MOUNTED=$(mount | grep "$TARGET" | grep "$HOSTS_FILE")
    if [ -z "$MOUNTED" ]; then
        mount -o bind "$HOSTS_FILE" "$TARGET"
        log "[post-fs-data] hosts overlay bind-mount activated"
    else
        log "[post-fs-data] hosts overlay already activated"
    fi
else
    log "[post-fs-data] hosts file not found!"
fi