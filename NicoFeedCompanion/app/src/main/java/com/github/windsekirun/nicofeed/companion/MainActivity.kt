package com.github.windsekirun.nicofeed.companion

import android.app.Activity
import android.app.ActivityManager
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val url = intent.data
        if (url == null) {
            toast("no url")
            finish()
        }

        val path = url?.authority

        val manager: ActivityManager =
            getSystemService(Activity.ACTIVITY_SERVICE) as ActivityManager
        manager.killBackgroundProcesses(PACKAGE_NAME)

        val intent = Intent(Intent.ACTION_VIEW).apply {
            data = Uri.parse("nico://watch/${path}")
            setPackage(PACKAGE_NAME)
            flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        startActivity(intent)
        finish()
        finishAffinity()
    }

    private fun toast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    companion object {
        private const val PACKAGE_NAME = "jp.nicovideo.android"
    }
}