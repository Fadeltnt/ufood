import Slider from '../Slider/Slider.jsx'
import { useItemsPerScreen } from '../../hooks/useItemsPerScreen.js'

export default function RestoCarousel({ images }) {
  const itemsPerScreen = useItemsPerScreen()

  return (
    <div>
      <Slider
        images={images}
        genre={`Photos`}
        itemsPerScreen={itemsPerScreen}
      />
    </div>
  )
}
