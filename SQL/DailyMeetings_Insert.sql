USE [MiVet]
GO
/****** Object:  StoredProcedure [dbo].[DailyMeetings_Insert]    Script Date: 11/18/2022 3:06:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Jonathan Mercado
-- Create date: 11/04/22
-- Description:	Inserts a Daily Video Chat Rooms Information
-- Code Reviewer: Gideon Macapagal


-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer: 
-- Note: 
-- =============================================

ALTER proc [dbo].[DailyMeetings_Insert]
								@DailyParticipants dbo.DailyParticipants READONLY
								,@HostId int
								,@DailyId nvarchar(128)
								,@Duration int
								,@Id int OUTPUT

as

/*
Declare @HostId int = 30
		,@DailyId nvarchar(128) = '12376-ajf-1234'
		,@Duration int = 123
		,@Id int = 0

Declare @DailyParticipants dbo.DailyParticipants

Insert into @DailyParticipants (MeetingId, Name, Duration, TimeJoined)
Values ('123-123', 'Jonathan', 123, 222)

Insert into @DailyParticipants (MeetingId, Name, Duration, TimeJoined)
Values ('123-123', 'Jason', 123, 222)



		Execute dbo.DailyMeetings_Insert
								@DailyParticipants
								,@HostId 
								,@DailyId 
								,@Duration 				
								,@Id OUTPUT

SELECT [Id]
      ,[HostId]
      ,[DailyId]
      ,[Duration]
      ,[DateCreated]
	  ,Participants = ( 
						   Select dp.Id
								 ,dp.MeetingId
								 ,dp.Name
								 ,dp.Duration
								 ,dp.TimeJoined
						   From dbo.DailyParticipants as dp inner join dbo.MeetingParticipants as mp
									on dp.Id = mp.ParticipantId
						   Where mp.MeetingId = @Id
						   FOR JSON AUTO
						   )

  FROM [dbo].[DailyMeetings]
  Where Id = @Id

*/

BEGIN

INSERT INTO [dbo].[DailyMeetings]
           ([HostId]
           ,[DailyId]
           ,[Duration])
     VALUES
           (@HostId
           ,@DailyId
           ,@Duration)

		   Set @Id = SCOPE_IDENTITY()


Insert into dbo.DailyParticipants (MeetingId 
									,[Name]
									,Duration
									,TimeJoined)

Select dp.MeetingId
	  ,dp.[Name]
	  ,dp.Duration
	  ,dp.TimeJoined
From @DailyParticipants as dp
Where Not Exists(
				Select 1
				From dbo.DailyParticipants as p
				Where p.MeetingId = dp.MeetingId
				AND p.[Name] = dp.[Name])


INSERT INTO [dbo].[MeetingParticipants]
           ([MeetingId]
           ,[ParticipantId])

	Select @Id
			,p.Id
		From dbo.DailyParticipants as p
		Where Exists (
						Select 1
						From @DailyParticipants as dp
						Where p.MeetingId = dp.MeetingId
						AND p.Name = dp.Name)
    
END


