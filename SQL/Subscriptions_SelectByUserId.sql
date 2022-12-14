USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[Subscriptions_SelectByUserId]    Script Date: 11/18/2022 3:08:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Jonathan Mercado
-- Create date: 11/15/22
-- Description:	Selects by userId to grab subscription information
-- Code Reviewer: Simon E. Dilger


-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note: 
-- =============================================

ALTER proc [dbo].[Subscriptions_SelectByUserId]
										@UserId int

as

/*

Declare @UserId int = 75

Execute dbo.Subscriptions_SelectByUserId
										@UserId

*/

BEGIN

SELECT s.[Id]
      ,s.[SubscriptionId]
      ,s.[UserId]
      ,s.[CustomerId]
      ,s.[DateEnded]
      ,s.[isActive]
	  ,ProductId = (
						Select sp.stripeProductId
							From dbo.stripeProductSubscription as sp					
							Where sp.subscriptionId = s.SubscriptionId
							FOR JSON AUTO)
  FROM [dbo].[Subscriptions] as s
  Where s.UserId = @UserId
  ORDER BY s.Id DESC

END


