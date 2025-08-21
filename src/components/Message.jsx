export default function Message({ msg, meId, onDelete }) {
  const mine = msg.userId === meId || msg.user_id === meId || msg.ownerId === meId || msg.owner_id === meId
  return (
    <div className={mine ? 'bubble me' : 'bubble other'}>
      <div style={{fontSize:12}} className="muted">
        {msg.username || msg.user?.username || (mine ? 'Du' : 'Användare')}
      </div>
      <div>{msg.message}</div>
      {mine && (
        <button onClick={onDelete} style={{marginTop:6,fontSize:11,textDecoration:'underline',background:'transparent',border:'none',color:'inherit',cursor:'pointer'}}>Radera</button>
      )}
    </div>
  )
}
