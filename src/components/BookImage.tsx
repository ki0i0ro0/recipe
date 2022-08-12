interface Props {
  url?: string
}

const BookImage = (props: Props): JSX.Element => {
  const { url } = props
  if (!url) return <></>
  return <img src={`http://images-jp.amazon.com/images/P/${url}.09.MZZZZZZZ`} alt="book" />
}

export default BookImage
