using System.ComponentModel.DataAnnotations;

namespace UrlShorter.Db
{
    public class UrlMap
    {
        [Key]
        public int Id { get; set; }
        public string Url { get; set; }
    }
}