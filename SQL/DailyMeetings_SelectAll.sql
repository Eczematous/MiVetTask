USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[DailyMeetings_SelectAll]    Script Date: 11/18/2022 3:07:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Jonathan Mercado
-- Create date: 11/04/22
-- Description:	Select All Daily Video Chat Rooms 
-- Code Reviewer: Gideon Macapagal


-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note: 
-- =============================================

ALTER proc [dbo].[DailyMeetings_SelectAll]

as

/*

Execute dbo.DailyMeetings_SelectAll

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
  Order By DateCreated DESC

END


