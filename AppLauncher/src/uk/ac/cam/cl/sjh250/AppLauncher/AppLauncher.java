package uk.ac.cam.cl.sjh250.AppLauncher;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

import org.ini4j.Wini;

public class AppLauncher {
	
	public static final String INIFILE = "config.ini";
	public static boolean isRunning = false;
	public static String application = "";
	
	public static void main(String[] args) throws Exception {
		// Load the ini file
		String filename = (args.length > 0) ? args[0] : INIFILE;
		Wini ini = new Wini(new File(filename));
		int port = ini.get("AppLauncher", "port", int.class);
		application = ini.get("AppLauncher", "application", String.class);
		
		// Create the server
		@SuppressWarnings("resource")
		ServerSocket serverSocket = new ServerSocket(port);
		Socket socket;
		do {
			socket = serverSocket.accept();
			
			// Allow the client to send its data
			BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
			String sCurrentLine;
			boolean processRequest = false;
			while ((sCurrentLine = in.readLine()) != null) {
				if (sCurrentLine.matches("\\w*")) {
					// A blank line indicates the end of a HTTP request
					break;
				} else if (sCurrentLine.matches("GET /(\\?.*)? HTTP/1\\.1")) {
					// Only process the request if the client is requesting / (most browsers will also ask for favicon.ico immediately afterwards)
					processRequest = true;
				}
			}
			
			// Respond to the HTTP request
			PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
			out.print("HTTP/1.1 200 OK\nContent-Type: text/plain; charset=utf-8\nContent-Length: 18\n\nLaunching program.");
			out.flush();

			// Close the socket
			socket.close();
			
			// Start the process only if it isn't already running
			if (processRequest && isRunning == false) {
				(new Thread(new AppThread())).start();
			}
			
			
		} while (true); // keep the server open for subsequent requests

	}

}
