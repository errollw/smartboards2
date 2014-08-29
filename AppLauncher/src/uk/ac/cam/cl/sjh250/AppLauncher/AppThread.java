package uk.ac.cam.cl.sjh250.AppLauncher;

public class AppThread implements Runnable {
	public void run() {
		AppLauncher.isRunning = true;
		Process process;
		try {
			process = new ProcessBuilder(AppLauncher.application).start();
			process.waitFor();
		} catch (Exception e) {
			e.printStackTrace();
		}
		AppLauncher.isRunning = false;
	}
}
