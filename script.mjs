#!/usr/bin/env zx

const rclonePath = 'remoteBackupCrypt:/'

let ignored = ['.TemporaryItems', '.fseventsd', 'Content', 'storage_goal', 'read_only.settings', 'restore_information', 'public', 'protocol', 'times', 'uuid', 'capabilities.project.add_user', 'capabilities.project.quota', 'capabilities.project.read_only_media', 'capabilities.project.remove_user', 'capabilities.project.summary', 'playout']
let skip = ['Trash']

async function getJson(rclonePath) {
    const response = await $`rclone lsjson ${rclonePath}`;
    const parsed = JSON.parse(response);
    return parsed;
};

async function cleanDir(workingDir) {
    const contents = await getJson(workingDir)
    contents.forEach(item => {
        if (ignored.includes(item.Name)) { return }
        $`rclone moveto ${path.join(workingDir, item.Name)} ${path.join(workingDir, 'Content', item.Name)}`
    });
};

const root = await getJson(rclonePath);

root.forEach(proj => {
    if (skip.includes(proj.Name)) { return }
    cleanDir(path.join(rclonePath, proj.Name))
});