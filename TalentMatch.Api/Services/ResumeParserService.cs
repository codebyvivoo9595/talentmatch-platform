using UglyToad.PdfPig;

namespace TalentMatch.Api.Services
{
    public class ResumeParserService
    {
        public string ExtractTextFromPdf(Stream pdfStream)
        {
            using var document = PdfDocument.Open(pdfStream);

            var text = "";

            foreach (var page in document.GetPages())
            {
                text += page.Text;
            }

            return text;
        }
    }
}




