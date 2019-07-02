using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UrlShorter.Db;
using UrlShorter.Services;

namespace UrlShorter.Api
{
    [Route("[controller]")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        private readonly HashService _hashService;
        private readonly ApplicationDbContext _db;

        public ApiController(ApplicationDbContext db, HashService hashService)
        {
            _hashService = hashService;
            _db = db;
        }

        private int HashToId(string hash)
        {
            var res = 0;
            if (hash != null)
            {
                hash = Uri.UnescapeDataString(hash);
                var baseUrl = $"{Request.Scheme}://{Request.Host}/";
                if (hash.ToLower().StartsWith(baseUrl.ToLower()))
                {
                    hash = hash.Substring(baseUrl.Length);
                }
                res = _hashService.HashToId(hash);
            }
            return res;
        }

        // GET xxxx
        /// <summary>
        /// Gets the url by its `hash` from the database.
        /// If the database doesn't contain this url - it returns `null`.
        /// WebApi: GET xxxx
        /// </summary>
        /// <param name="hash">The `hash` to process</param>
        /// <returns>URL of the passed `hash`. If `hash` doesn't exist - `null`</returns>
        [HttpGet("{hash}")]
        public async Task<string> GetAsync(string hash)
        {
            string res = null;
            var id = HashToId(hash);
            if (id > 0)
            {
                var entry = await _db.UrlMaps.FindAsync(id).ConfigureAwait(false);
                if (entry != null)
                {
                    res = entry.Url;
                }
            }
            return res;
        }


        /// <summary>
        /// Creates new `hash` by URL and writes it to the database.
        /// If the database already contains this url - it returns the exisiting hash.
        /// WebApi: POST api
        /// </summary>
        /// <param name="url">The URL to process</param>
        /// <returns>`Hash` of the passed URL</returns>
        [HttpPost]
        public async Task<string> Post([FromBody] string url)
        {
            // try to find the exact url in db
            var id = await _db.UrlMaps.Where(x => x.Url == url).Select(x => x.Id).FirstOrDefaultAsync().ConfigureAwait(false);
            if (id == 0)
            {
                var entry = await _db.UrlMaps.AddAsync(new UrlMap {Url = url}).ConfigureAwait(false);
                await _db.SaveChangesAsync().ConfigureAwait(false);
                id = entry.Entity.Id;
            }

            var hash = _hashService.IdToHash(id);
            return hash;
        }


        /// <summary>
        /// Executes the <paramref name="action"/> under the database entry related to the `hash`.
        /// After the action database changes will be saved.
        /// </summary>
        /// <param name="hash">`Hash` of the database entry</param>
        /// <param name="action">An action to executing.</param>
        /// <returns>`true` if the hash exists. `false` othewise.</returns>
        private async Task<bool> ProcessHashEntryAsync(string hash, Action<UrlMap> action)
        {
            var res = false;
            var id = HashToId(hash);
            if (id > 0)
            {
                var entry = await _db.UrlMaps.FindAsync(id).ConfigureAwait(false);
                if (entry != null)
                {
                    res = true;
                    action(entry);
                    await _db.SaveChangesAsync().ConfigureAwait(false);
                }
            }
            return res;
        }

        /// <summary>
        /// Changes URL linked with the <paramref name="hash"/>.
        /// WebApi: PUT api/xxx 
        /// </summary>
        /// <param name="hash">`Hash` of the URL</param>
        /// <param name="url">New URL</param>
        /// <returns>`true` if the `hash` exists and changed. `false` othewise.</returns>
        [HttpPut("{hash}")]
        public Task<bool> Put(string hash, [FromBody] string url) => ProcessHashEntryAsync(hash, entry => entry.Url = url);

        /// <summary>
        /// Remove the hash from the database.
        /// WebApi: DELETE api/xxx
        /// </summary>
        /// <param name="hash">`Hash` of the URL</param>
        /// <returns>`true` if the `hash` exists and removed. `false` othewise.</returns>
        [HttpDelete("{hash}")]
        public Task<bool> Delete(string hash) => ProcessHashEntryAsync(hash, entry => _db.UrlMaps.Remove(entry));
    }
}