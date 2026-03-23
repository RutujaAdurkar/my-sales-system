USE Compny;
GO

SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

DROP PROCEDURE IF EXISTS dbo.usp_getItemMaster;
GO

CREATE PROCEDURE dbo.usp_getItemMaster
(
    @ID INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ID, 
        ItemCode,
        ItemName,
        GroupId,
        UOM,
        SalesPrice,
        OpeningStock,
        CurrentStock,
        ReorderLevel,
        MinLevel,
        MaxLevel,
        OpeningValue,
        BasicPrice,
        FF_HW,
        DeliveryCode,
        DateOfValidity,
        Location,
        Comments,
        StockFactor,
        TransitDays,
        CustomDuty,
        MasterId,  
        SubstituteItem,
        QuotationCurrency,
        Make,
        Details,
        ISBOM,
        HSNCode, 
        CGST,
        SGST,
        IGST,
        TypeDesignation,
        ExciseHeadNo,
        CustomerReorder
    FROM dbo.vw_ItemMaster_Order
    WHERE (@ID IS NULL OR ID = @ID)
    ORDER BY ID DESC;
END;
GO

-- Test
EXEC dbo.usp_getItemMaster;
GO
