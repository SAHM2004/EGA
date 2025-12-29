package com.ega.bank.util;

import com.ega.bank.dto.TransactionDTO;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class PdfGenerator {

    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD,
            new BaseColor(59, 130, 246));
    private static final Font SUBHEADER_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);
    private static final Font TABLE_HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);

    public ByteArrayInputStream generateStatement(List<TransactionDTO> transactions, String accountNumber) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Header Section
            Paragraph title = new Paragraph("EGA BANK - RELEVÉ DE COMPTE", HEADER_FONT);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // Account Info
            Paragraph accountInfo = new Paragraph();
            accountInfo.add(new Chunk("Numéro de Compte: ", SUBHEADER_FONT));
            accountInfo.add(new Chunk(accountNumber, NORMAL_FONT));
            accountInfo.add(Chunk.NEWLINE);
            accountInfo.add(new Chunk("Date de génération: ", SUBHEADER_FONT));
            accountInfo.add(
                    new Chunk(java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                            NORMAL_FONT));
            document.add(accountInfo);

            document.add(new Paragraph(" "));
            LineSeparator ls = new LineSeparator();
            ls.setLineColor(new BaseColor(226, 232, 240));
            document.add(new Chunk(ls));
            document.add(new Paragraph(" "));

            // Transaction Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 3, 2, 2, 3 });

            // Table Headers
            addTableHeader(table, "Date & Heure");
            addTableHeader(table, "Opération");
            addTableHeader(table, "Type");
            addTableHeader(table, "Montant (FCFA)");

            // Table Content
            for (TransactionDTO transaction : transactions) {
                table.addCell(createCell(
                        transaction.getDateOperation().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))));
                table.addCell(createCell(translateType(transaction.getType().toString())));
                table.addCell(createCell(transaction.getType().toString()));

                PdfPCell amountCell = createCell(String.format("%,.0f", transaction.getMontant()) + " FCFA");
                if (transaction.getType().toString().contains("WITHDRAWAL")
                        || transaction.getType().toString().contains("TRANSFER_OUT")) {
                    amountCell.setPhrase(new Phrase("-" + amountCell.getPhrase().getContent(),
                            new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.RED)));
                } else {
                    amountCell.setPhrase(new Phrase("+" + amountCell.getPhrase().getContent(),
                            new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, new BaseColor(16, 185, 129))));
                }
                amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(amountCell);
            }

            document.add(table);

            // Footer
            document.add(new Paragraph(" "));
            Paragraph footer = new Paragraph(
                    "Ceci est un document officiel généré par le système EGA BANK. Merci de votre confiance.",
                    new Font(Font.FontFamily.HELVETICA, 8, Font.ITALIC, BaseColor.GRAY));
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addTableHeader(PdfPTable table, String headerTitle) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(new BaseColor(51, 65, 85));
        header.setBorderWidth(1);
        header.setPadding(8);
        header.setPhrase(new Phrase(headerTitle, TABLE_HEADER_FONT));
        header.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(header);
    }

    private PdfPCell createCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, NORMAL_FONT));
        cell.setPadding(6);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderColor(new BaseColor(226, 232, 240));
        return cell;
    }

    private String translateType(String type) {
        switch (type) {
            case "DEPOSIT":
                return "Versement";
            case "WITHDRAWAL":
                return "Retrait";
            case "TRANSFER":
                return "Virement";
            default:
                return type;
        }
    }
}
