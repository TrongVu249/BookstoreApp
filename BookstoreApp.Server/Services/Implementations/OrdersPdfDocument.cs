using BookstoreApp.Server.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;


namespace BookstoreApp.Server.Services.Implementations
{
    public class OrdersPdfDocument: IDocument
    {
        private readonly List<Order> _orders;

        public OrdersPdfDocument(List<Order> orders)
        {
            _orders = orders;
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(20);
                page.Content().Column(col =>
                {
                    col.Item().Text("ORDER REPORT")
                        .FontSize(18)
                        .Bold();

                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Order ID").Bold();
                            header.Cell().Text("Customer").Bold();
                            header.Cell().Text("Total").Bold();
                        });

                        foreach (var order in _orders)
                        {
                            table.Cell().Text(order.Id.ToString());
                            table.Cell().Text(order.User.FullName);
                            table.Cell().Text(order.TotalAmount.ToString("N0"));
                        }
                    });
                });
            });
        }
    }
}
