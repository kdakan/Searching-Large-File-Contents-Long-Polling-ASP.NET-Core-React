using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FileSearchService
{
    public class FileFinder
    {
        public async Task SearchFiles(string path, Regex searchTermRegex, Stream responseBody)
        {
            const int bufferSize = 1024 * 1024;//11;//1024 * 1024;
            //we are handling the case where the buffer ends in the middle of the search term, 
            //by adding the end 1 char smaller part to the beginning of the buffer on the next read 
            var searchTermSize = searchTermRegex.ToString().Length;
            var windowSize = bufferSize - searchTermSize;

            var di = new DirectoryInfo(path);
            var files = di.EnumerateFiles();
            Parallel.ForEach(files, async file =>
            {
                try
                {

                    var buffer = new char[bufferSize + searchTermSize - 1];
                    int count = 1;
                    var leftover = string.Empty;
                    long matchesCount = 0;

                    using (var sr = new StreamReader(file.FullName, true))
                    {
                        while (true)
                        {
                            count = sr.ReadBlock(buffer, 0, bufferSize);
                            if (count == 0)
                                break;

                            var text = new StringBuilder(leftover).Append(buffer, 0, count).ToString();

                            var matches = searchTermRegex.Matches(text);
                            matchesCount += matches.Count;

                            if (text.Length - searchTermSize + 1 >= 0)
                                leftover = text.Substring(text.Length - searchTermSize + 1, searchTermSize - 1);
                            else
                                leftover = string.Empty;
                        }
                    }

                    if (matchesCount != 0)
                    {
                        //write to response output stream
                        using (var sw = new StreamWriter(responseBody))
                        {
                            sw.Write("Found ");
                            sw.Write(matchesCount);
                            sw.Write(matchesCount == 1 ? " time in " : " times in ");
                            sw.Write(file.FullName);
                            sw.Write(@"*");
                        }
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            });

            var directories = di.EnumerateDirectories();

            Parallel.ForEach(directories, async directory =>
            {
                try
                {
                    await SearchFiles(directory.FullName, searchTermRegex, responseBody);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            });
        }
    }
}
