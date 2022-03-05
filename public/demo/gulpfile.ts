import gulp from "gulp"
import webpack from "webpack"
import path from "path"
import { exec } from "child_process"

import webpackConfig from "./webpack.config";

gulp.task("build", async () => {
    return new Promise<void>((resolve, reject) => {
        webpack(webpackConfig).watch(webpackConfig.watchOptions,(err, stats) => {
            if (err) {
                console.log("error", err);
                reject();
            } else {
                console.log("success", stats ? stats.compilation.errors : null)
                resolve();
            }
        })
    })
});

gulp.task("build.server", async () => {
    exec('start cmd.exe /K tsc -w -p tsconfig.server.json', { cwd: path.join(process.cwd()) }, (err, stdout, stderr) => {
        if (err) {
            console.log(err,stderr);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })

    exec('start cmd.exe /K nodemon', { cwd: path.join(process.cwd()) }, (err, stdout, stderr) => {
        if (err) {
            console.log(err,stderr);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })
})