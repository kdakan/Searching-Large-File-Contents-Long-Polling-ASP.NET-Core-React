using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace FileSearchService.Controllers
{
    [ApiController]
    public class SearchController : ControllerBase
    {
        private FileFinder fileFinder;

        public SearchController(FileFinder fileFinder)
        {
            this.fileFinder = fileFinder;
        }

        [HttpGet("api/servers")]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "localhost", "someserver" };
        }

        [HttpPost("api/search/{term}")]
        public async void PostAsync(string term, [FromForm] string path)
        {
            Response.StatusCode = 200;
            Response.ContentType = "text/plain";
            var searchTermRegex = new Regex(term, RegexOptions.Compiled);
            try
            {
                await fileFinder.SearchFiles(path, searchTermRegex, Response.Body);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

    }
}
