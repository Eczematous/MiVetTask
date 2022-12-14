USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[DailyMeetings_SelectByHostId]    Script Date: 11/18/2022 3:07:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Jonathan Mercado
-- Create date: 11/10/22
-- Description:	Select Daily Video Chat Room by Host Id
-- Code Reviewer: Sebastian Hernandez


-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note: 
-- =============================================

ALTER proc [dbo].[DailyMeetings_SelectByHostId]
											@HostId int

as

/*
Declare @HostId int = 35

Execute dbo.DailyMeetings_SelectByHostId
									@HostId

*/

BEGIN

SELECT [Id]
      ,[HostId]
      ,[DailyId]
      ,[Duration]
      ,[DateCreated]
	  ,Participants = ( 
						   Select dp.Id
								 ,dp.MeetingId
								 ,dp.[Name]
								 ,dp.Duration
								 ,dp.TimeJoined
						   From dbo.DailyParticipants as dp inner join dbo.MeetingParticipants as mp
									on dp.Id = mp.ParticipantId
							Where mp.MeetingId = dm.Id
						   FOR JSON AUTO
						   )

  FROM [dbo].[DailyMeetings] as dm
  Where dm.HostId = @HostId
  Order By DateCreated DESC

END


