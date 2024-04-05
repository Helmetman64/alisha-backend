USE ALISHA;

-- Drop tables if they exist
IF OBJECT_ID('Sales') IS NOT NULL
    DROP TABLE Sales;

IF OBJECT_ID('Items') IS NOT NULL
    DROP TABLE Items;

-- Create Items table
CREATE TABLE Items
(
    itemID INT IDENTITY(1,1),
    itemName NVARCHAR(100),
    itemPrice INT,
    itemQTY INT,
    imageName NVARCHAR(100),
    PRIMARY KEY (itemID)
);

-- Create Sales table
CREATE TABLE Sales
(
    saleID INT IDENTITY(1,1) PRIMARY KEY,
    itemID INT NOT NULL,
    itemName NVARCHAR(100),
    salePrice INT NOT NULL,
    qtySold INT NOT NULL,
    saleDate NVARCHAR(100) NOT NULL,
    FOREIGN KEY (itemID) REFERENCES Items(itemID)
);

-- Procedure to update item details
IF OBJECT_ID('EditItem') IS NOT NULL
    DROP PROCEDURE EditItem;
GO

CREATE PROCEDURE EditItem
    @itemID INT,
    @newPrice INT,
    @newQuantity INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the item exists
    IF NOT EXISTS (SELECT 1
    FROM Items
    WHERE itemID = @itemID)
    BEGIN
        RAISERROR('Item not found', 16, 1);
        RETURN;
    END

    -- Update item price and quantity
    UPDATE Items
    SET itemPrice = @newPrice,
        itemQTY = @newQuantity
    WHERE itemID = @itemID;
END;
GO

-- Procedure to update stock quantity
IF OBJECT_ID('UpdateStockQuantity') IS NOT NULL
    DROP PROCEDURE UpdateStockQuantity;
GO

CREATE PROCEDURE UpdateStockQuantity
    @itemID INT,
    @newQuantity INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the item exists
    IF NOT EXISTS (SELECT 1
    FROM Items
    WHERE itemID = @itemID)
    BEGIN
        RAISERROR('Item not found', 16, 1);
        RETURN;
    END

    -- Update item quantity
    UPDATE Items
    SET itemQTY = @newQuantity
    WHERE itemID = @itemID;
END;
GO

-- Procedure to record a sale
IF OBJECT_ID('RecordSale') IS NOT NULL
    DROP PROCEDURE RecordSale;
GO

CREATE PROCEDURE RecordSale
    @itemID INT,
    @itemName NVARCHAR(100),
    @salePrice INT,
    @qtySold INT,
    @saleDate NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert sale details into Sales table
    INSERT INTO Sales
        (itemID, itemName, salePrice, qtySold, saleDate)
    VALUES
        (@itemID, @itemName, @salePrice, @qtySold, @saleDate);
END;
GO
