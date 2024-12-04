import React from 'react';
import { useMeetingState, useNetwork, useParticipantIds, useRoom } from '@daily-co/daily-react';
import './MeetingInformation.css';

export default function MeetingInformation() {
  const room = useRoom();
  const network = useNetwork();
  const allParticipants = useParticipantIds();
  const meetingState = useMeetingState();

  return (
    <section className="meeting-information">
      <h1>Meeting information</h1>
      {/* 会議、部屋、参加者、およびネットワークに関する情報を表示infoアイコンででる */}
      <ul>
        <li>Meeting state: {meetingState ?? 'unknown'}</li>
        <li>Meeting ID: {room?.id ?? 'unknown'}</li>
        <li>Room name: {room?.name ?? 'unknown'}</li>
        <li>Network status: {network?.threshold ?? 'unknown'}</li>
        <li>Network topology: {network?.topology ?? 'unknown'}</li>
        <li>Participant IDs: {allParticipants.join(', ')}</li>
      </ul>
    </section>
  );
}
