import { useSelector } from 'react-redux'
import { Store } from '../store/type'

export default (key: keyof Store) => {
  return useSelector<Store>((state) => state[key])
}
