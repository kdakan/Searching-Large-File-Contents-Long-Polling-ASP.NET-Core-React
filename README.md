# Searching Large File Contents & Long-Polling
Search contents of very long files with long-polling, using ASP.NET Core 2.1 and React. This was an assignment for a job application in a full-stack role.

## General description:
- Write a simple C# service that scans all file for its contents in a given folder and its subfolders for a plain text search term, and returns the list of matching files, their number of matches and the server they reside.
- The frontend to accept the parameters and output the results can be written with your preferred JS framework (Angular, React.js, Vue.js, etc). Do not use C# Asp.Net for the frontend.

## Service requirements:
1. The service has to expose 2 endpoints:
   - One to get a list of servers
   - One to perform the search on a given folder on the selected servers.

2. GetServers endpoint should return a list of available servers where to perform the search in.
This can be a hardcoded list of names for testing purposes.
One of them should be “localhost”, so the search can be performed on the same server executing the endpoint for testing purposes.

3. Search endpoint should accept the search parameters and return a list of results in real time:
   - Input parameters: The path of the folder to scan.
   - Input parameters: The search term to match.
   - The result should be a list of matches returned as soon as they are found. Do not wait to get all the results to send them back to the frontend. The search should continue and all results should be returned eventually.

4. The service should be optimized for speed. Make use of multiple threads for enumerating the files and subfolders and scanning the file contents. Please avoid using Directory.GetDirectories and Directory.GetFiles as these methods only return when all the items are enumerated (which causes unnecessary delay) and they return the results in a single array (which may cause OutOfMemoryException depending on the number of files under the folder being scanned)

5. The service should be able to handle large amounts of data. Make sure the program can handle large files (larger than the amount of memory available to your program), lots of files (more than what you can fit into a single array), and a deep folder hierarchy. Please don’t expect the result list to fit in memory either.

6. The service should be resilient to file system exceptions. Make sure the program scans what it can and ignores any files and/or folders it cannot access.

## Frontend Requirements:
1. Welcome page
   - It should present a list of servers (returned by the backend) where to perform the search. Note that the search can be performed in multiple servers simultaneously.
   - It should have fields to introduce the search path and the search term.

2. Results page
   - Results should appear as soon as they are returned by the backend.
   - The user should be aware of the search status (in progress / finished). 

## Hint: 
- The most important parts are the design, solving problems (error handling) and proof of concept. Also make sure it works and the code is clean, shaped well with no carelessness hence clean. Emphasis on pushing it to edge case, is it efficient and working with ‘scale’ in mind. Again emphasis on bespoke code, flexibility to extend if need be.

- Some feedback on previous tests to give you an idea of the typical mistakes we see regularly

- We don’t want to progress with XXX’s application. His solution has all the typical problems, plus a few more:

- Single threaded – the exercise was about building a multi-threaded app
- Keeps all results in memory
- Output CSV is invalid if any of the matched files has a comma in their name
- Uses StreamReader.ReadLine to read whole lines into memory – won’t work for files with extremely long lines
- Using StreamReader.EndOfStream is inefficient
- The app is only counting one match per line. If a line has multiple matches, the result is incorrect
- The check in the FileInUse method is pointless – AnalyseFile can fail to access the file even if FileInUse returns false (someone can start using the file between the call to FileInUse and the call to AnalyseFile)
- Although the code is well designed and structured, we think that the actual implementation does not fit our reliability and performance standards. There are a few technical issues that should have been addressed in a better way, for instance:
  - streamReader.ReadLine() is not the best choice as it can lead to OutOfMemory exceptions if the line does not fit in memory. This can easily happen if all text is in one single line. Even in cases when the line fits in memory, is not a good idea to have a big chunk of data in memory.
- Encoding handling. Files are read as UTF-8 by default. What happens if files have another encoding? At least we expected a comment stating something about this problem.
- Locking for writing the results is not a good pattern in this case as it will block all threads willing to write. A better approach is to use a writer queue with a dedicated thread for writing.
- There is no control over the number of threads reading from files. Multiple reads from the same physical device can downgrade performance as IO is the bottleneck in these cases. At least a comment stating this issue was expected.
- Regex.Matches will create a new instance of the Regex class and check the global regex cache for each call. It would have been more efficient to use a pre-created instance of the Regex class.
