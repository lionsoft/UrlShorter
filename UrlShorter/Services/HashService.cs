using System.Linq;

namespace UrlShorter.Services
{
    public class HashService
    {
        /// <summary>
        /// Converts integer identifier to simple string 'hash'.
        /// This implementation simple translate 1 -> `a`, 2 -> `b`, 12 -> `ab`
        /// </summary>
        public string IdToHash(int id)
        {
            var res = id.ToString().Select(c => (char) ((byte) c + 0x11)).Aggregate("", (s, c) => s + c).ToLower();
            return res;
        }

        /// <summary>
        /// Restore integer identifier from string 'hash'.
        /// This implementation simple translate `a` -> 1, `b` -> 2, `ab` -> 12
        /// Returns 0 for invalid hash.
        /// </summary>
        public int HashToId(string hash)
        {
            var res = 0;
            if (!string.IsNullOrWhiteSpace(hash))
            {
                var sid = hash.ToUpper().Select(c => (char) ((byte) c - 0x11)).Aggregate("", (s, c) => s + c);
                int.TryParse(sid, out res);
            }
            return res;
        }
    }
}
