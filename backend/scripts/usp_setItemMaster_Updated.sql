USE Compny;
GO

SET ANSI_NULLS ON;
GO
SET QUOTED_IDENTIFIER ON;
GO

DROP PROCEDURE IF EXISTS dbo.usp_setItemMaster;
GO

CREATE PROCEDURE dbo.usp_setItemMaster
(
    @ID INT = 0,
    @UOM NVARCHAR(6) = NULL,
    @GroupId INT = NULL,
    @OpeningStock DECIMAL(18,2) = NULL,
    @ItemName NVARCHAR(100) = NULL,
    @TypeDesignation NVARCHAR(100) = NULL,
    @ItemCode NVARCHAR(20) = NULL,
    @MasterId INT = NULL,
    @CurrentStock DECIMAL(18,2) = NULL,
    @FF_HW NVARCHAR(10) = NULL,
    @SalesPrice DECIMAL(18,2) = NULL,
    @DateOfValidity DATETIME = NULL, 
    @BasicPrice DECIMAL(18,2) = NULL,
    @OpeningValue DECIMAL(18,2) = NULL,
    @Location NVARCHAR(50) = NULL,
    @DeliveryCode NVARCHAR(5) = NULL,
    @ReorderLevel DECIMAL(18,2) = NULL,
    @MinLevel DECIMAL(18,2) = NULL,
    @MaxLevel DECIMAL(18,2) = NULL,
    @Make NVARCHAR(50) = NULL,
    @StockFactor DECIMAL(18,2) = NULL,
    @HSNCode NVARCHAR(15) = NULL,
    @CGST DECIMAL(18,2) = NULL,
    @SGST DECIMAL(18,2) = NULL,
    @IGST DECIMAL(18,2) = NULL,
    @Comments NVARCHAR(500) = NULL,
    @SubstituteItem NVARCHAR(20) = NULL,
    @QuotationCurrency NVARCHAR(3) = NULL,
    @TransitDays INT = NULL,
    @CustomDuty DECIMAL(18,2) = NULL,
    @Details NVARCHAR(400) = NULL,
    @ISBOM BIT = 0,
    @CustomerReorder DECIMAL(18,2) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @ID = 0
    BEGIN
        INSERT INTO ItemMaster
        (
            UOM, GroupId, OpeningStock, ItemName, TypeDesignation,
            ItemCode, MasterId, CurrentStock, FF_HW, SalesPrice,
            DateOfValidity, BasicPrice, OpeningValue, Location,
            DeliveryCode, ReorderLevel, MinLevel, MaxLevel,
            Make, StockFactor, HSNCode, CGST, SGST, IGST,
            Comments, SubstituteItem, QuotationCurrency,
            TransitDays, CustomDuty, Details, ISBOM, CustomerReorder
        )
        VALUES
        (
            @UOM, @GroupId, @OpeningStock, @ItemName, @TypeDesignation,
            @ItemCode, @MasterId, @CurrentStock, @FF_HW, @SalesPrice,
            @DateOfValidity, @BasicPrice, @OpeningValue, @Location,
            @DeliveryCode, @ReorderLevel, @MinLevel, @MaxLevel,
            @Make, @StockFactor, @HSNCode, @CGST, @SGST, @IGST,
            @Comments, @SubstituteItem, @QuotationCurrency,
            @TransitDays, @CustomDuty, @Details, @ISBOM, @CustomerReorder
        );

        SELECT SCOPE_IDENTITY() AS ID;
    END
    ELSE
    BEGIN
        UPDATE ItemMaster
        SET
            UOM = @UOM,
            GroupId = @GroupId,
            OpeningStock = @OpeningStock,
            ItemName = @ItemName,
            TypeDesignation = @TypeDesignation,
            ItemCode = @ItemCode,
            MasterId = @MasterId,
            CurrentStock = @CurrentStock,
            FF_HW = @FF_HW,
            SalesPrice = @SalesPrice,
            DateOfValidity = @DateOfValidity,
            BasicPrice = @BasicPrice,
            OpeningValue = @OpeningValue,
            Location = @Location,
            DeliveryCode = @DeliveryCode,
            ReorderLevel = @ReorderLevel,
            MinLevel = @MinLevel,
            MaxLevel = @MaxLevel,
            Make = @Make,
            StockFactor = @StockFactor,
            HSNCode = @HSNCode,
            CGST = @CGST,
            SGST = @SGST,
            IGST = @IGST,
            Comments = @Comments,
            SubstituteItem = @SubstituteItem,
            QuotationCurrency = @QuotationCurrency,
            TransitDays = @TransitDays,
            CustomDuty = @CustomDuty,
            Details = @Details,
            ISBOM = @ISBOM,
            CustomerReorder = @CustomerReorder
        WHERE ID = @ID;

        SELECT @ID AS ID;
    END
END;
GO

-- Test Insert
EXEC dbo.usp_setItemMaster
    @ItemName = 'Test Item',
    @ItemCode = 'IT001',
    @UOM = 'PCS',
    @SalesPrice = 100,
    @CustomerReorder = 25;

-- Test Update
EXEC dbo.usp_setItemMaster
    @ID = 1,
    @ItemName = 'Updated Item',
    @UOM = '10',
    @CustomerReorder = 50;
GO
