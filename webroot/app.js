/*!
 * CHost — KernelSU Hosts Manager
 * --------------------------------
 * File        : app.js
 * Version     : 1.2.0
 * Build Date  : 2026-01-12
 *
 * Description :
 * WebUI logic for managing hosts file via KernelSU.
 * Includes editor, mount status detection, apply/reset logic,
 * and safe CLI execution through ksu.exec().
 *
 * Author      : CHost Project
 * Maintainer  : ARe D
 *
 * License     : Apache 2.0
 *
 * Notes :
 * - Designed for KernelSU WebUI (Android WebView)
 * - Does NOT rely on browser confirm()/alert()
 * - Uses custom modal for user confirmation
 *
 * Changelog :
 * [1.2.0] - Added custom confirm modal (save/apply)
 *         - Added mount status detection
 *         - Improved log handling (append & auto-scroll)
 *
 * [1.1.0] - Introduced hosts editor & backup mechanism
 *
 * [1.0.0] - Initial release (read/apply hosts)
 */

const APP_NAME = "CHost 🌐";
const APP_VERSION = "1.2.0";
const APP_AUTHOR = "AReD Soft";
const HOSTS_PATH = "/data/adb/modules/chost/system/etc/hosts";
const BACKUP_PATH = "/sdcard/chost/hosts.bak";

//Display App Name
document.querySelectorAll("[app-name]").forEach(el => {
    el.textContent = APP_NAME;
});

//Display App Version
document.querySelectorAll("[app-version]").forEach(el => {
    el.textContent = APP_VERSION;
});

//display App Author
document.querySelectorAll("[app-author]").forEach(el => {
    el.textContent = APP_AUTHOR;
});

// Log
function appendLog(message) {
    const log = document.getElementById("log");
    log.textContent += message + "\n";
    log.scrollTop = log.scrollHeight;
}

//Clear Log
function clearLog() {
    document.getElementById("log").textContent = "";
}

// Device info
async function fetchDevice() {
    const out = document.getElementById("device");
    out.textContent = "Fetching device info...\n";

    if (!window.ksu) {
        out.textContent += "ERROR: KernelSU not available\n";
        return;
    }

    try {
        const model = await window.ksu.exec("getprop ro.product.model");
        const android = await window.ksu.exec("getprop ro.build.version.release");
        const kernel = await window.ksu.exec("uname -r");

        out.textContent =
            `Model   : ${model.trim()}\n` +
            `Android : ${android.trim()}\n` +
            `Kernel  : ${kernel.trim()}\n`;

    } catch (e) {
        out.textContent += "Error: " + e;
    }
}

const TARGET_HOSTS = "/system/etc/hosts";

// Check if hosts is bind-mounted
async function checkMountStatus() {
    const el = document.getElementById("mountStatus");

    el.textContent = "Checking...";
    el.className = "unknown";

    if (!window.ksu) {
        el.textContent = "KSU unavailable";
        el.className = "unknown";
        return;
    }

    try {
        const res = await window.ksu.exec(
            `mount | grep " ${TARGET_HOSTS} "`
        );

        if (res && res.trim()) {
            el.textContent = "Custom Host Active ✅";
            el.className = "mounted";
        } else {
            el.textContent = "Custom Host Not Active 💀";
            el.className = "unmounted";
        }

    } catch {
        el.textContent = "Not mounted";
        el.className = "unmounted";
    }
}

// Read hosts (KernelSU-safe)
async function readHosts() {
    const area = document.getElementById("hosts");
    const log = document.getElementById("log");

    appendLog("Reading hosts...\n");

    try {
        const cmd = `
awk '{ printf "%s__NL__", $0 }' ${HOSTS_PATH}
`.trim();

        const result = await window.ksu.exec(cmd);
        area.value = result.split("__NL__").join("\n").trim();

        appendLog("Hosts loaded successfully.\n");

    } catch (e) {
        appendLog("Error reading hosts: " + e + "\n");
    }
}

// Save edited hosts
async function saveHosts() {
    const text = document.getElementById("hosts").value;

    if (!text.trim()) {
        appendLog("ERROR: Hosts content empty. Aborted.\n");
        return;
    }

    const ok = await showConfirm(
        "Save Hosts Configuration",
        "This action will:\n" +
        "• Overwrite the current hosts file\n" +
        "• Create a backup at /sdcard/chost/hosts.bak\n" +
        "• Not apply changes to the system yet\n\n" +
        "Do you want to continue?"
    );

    if (!ok) {
        appendLog("Save cancelled by user.\n");
        return;
    }

    try {
        appendLog("Creating backup...\n");
        await window.ksu.exec(`cp ${HOSTS_PATH} ${BACKUP_PATH}`);

        appendLog("Writing hosts file...\n");
        const cmd = `
cat <<'EOF' > ${HOSTS_PATH}
${text}
EOF
`.trim();

        await window.ksu.exec(cmd);

        appendLog("Hosts saved successfully.\n");
        await readHosts();

    } catch (e) {
        appendLog("Save failed: " + e + "\n");
    }
}

// Apply via service.sh
async function applyHosts() {

    const ok = await showConfirm(
        "Apply Hosts Configuration",
        "This action will:\n" +
        "• Bind module hosts to /system/etc/hosts\n" +
        "• Immediately affect system-wide DNS\n" +
        "• Not require a reboot\n\n" +
        "Proceed with applying hosts?"
    );

    if (!ok) {
        appendLog("Apply cancelled by user.\n");
        return;
    }

    appendLog("Applying hosts...\n");

    try {
        const res = await window.ksu.exec(
            "/system/bin/sh /data/adb/modules/chost/service.sh"
        );

        appendLog(res || "Apply completed.\n");
        await readHosts();
        await checkMountStatus();

    } catch (e) {
        appendLog("Apply failed: " + e + "\n");
    }
}

//Show Confirmation Modal
function showConfirm(title, message) {
    return new Promise(resolve => {
        const modal = document.getElementById("confirmModal");
        const t = document.getElementById("confirmTitle");
        const m = document.getElementById("confirmMessage");
        const yes = document.getElementById("confirmYes");
        const no = document.getElementById("confirmNo");

        t.textContent = title;
        m.textContent = message;

        modal.classList.remove("hidden");

        const cleanup = () => {
            modal.classList.add("hidden");
            yes.onclick = null;
            no.onclick = null;
        };

        yes.onclick = () => {
            cleanup();
            resolve(true);
        };

        no.onclick = () => {
            cleanup();
            resolve(false);
        };
    });
}

//load status
document.addEventListener("DOMContentLoaded", () => {
    fetchDevice();
    readHosts();
    checkMountStatus();
});