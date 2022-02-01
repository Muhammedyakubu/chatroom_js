const mock_users = [{
    user_id: 1,
    username: "Foo"
},
{
    user_id: 2,
    username: "Jay"
},
{
    user_id: 3,
    username: "Jake"
},
{
    user_id: 4,
    username: "Bar"
}]

const mock_chats = [
  { content: 'Hey', sentBy: 'Foo', timeSent: 1642455471914 },
  { content: 'Yo What\'s up?', sentBy: 'Jake', timeSent: 1642455521517 },
  { content: 'Nothing much. Hbu?', sentBy: 'Foo', timeSent: 1642455527843 },
  {
    content: "I'm good. Just working on the problem set",
    sentBy: 'Jake',
    timeSent: 1642455540507
  },
  {
    content: 'Dude did you do the 297 reading yet? 😭',
    sentBy: 'Foo',
    timeSent: 1642455558186
  },
  { content: '👀 ', sentBy: 'Jay', timeSent: 1642455567315 },
  { content: 'what reading?', sentBy: 'Jake', timeSent: 1642455573315 },
  { content: '🤣', sentBy: 'Foo', timeSent: 1642455581002 },
  { content: 'okay good to know I\'m not alone in this LOL.', sentBy: 'Foo', timeSent: 1642455583954 },
  {
    content: 'Anyways I gotta go now. Bye!',
    sentBy: 'Foo',
    timeSent: 1642455594762
  }
]

const mock_active_users = {1: "Jay", 2: "Bar"}

module.exports = {mock_users, mock_chats, mock_active_users}