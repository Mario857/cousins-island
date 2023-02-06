import { createSvgIcon, SvgIcon } from '@mui/material'
import { ComponentType, createElement } from 'react'
import { ReactComponent as ArrowRight } from './assets/arrow-right.js'
import { ReactComponent as Wallet } from './assets/wallet.js'
import { ReactComponent as ExternalLink } from './assets/external-link.js'
import { ReactComponent as Discord } from './assets/discord.js'
import { ReactComponent as Medium } from './assets/medium.js'
import { ReactComponent as Telegram } from './assets/telegram.js'
import { ReactComponent as Twitter } from './assets/twitter.js'
import { ReactComponent as Plus } from './assets/plus.js'
import { ReactComponent as Minus } from './assets/minus.js'
import { ReactComponent as ArrowUp } from './assets/arrow-up.js'
import { ReactComponent as Info } from './assets/info.js'
import { ReactComponent as CheckCircle } from './assets/check-circle.js'
import { ReactComponent as Check } from './assets/check.js'
import { ReactComponent as Close } from './assets/close.js'
import { ReactComponent as CopyFile } from './assets/copy-file.js'
import { ReactComponent as LoginAlt } from './assets/login-alt.js'
import { ReactComponent as Menu } from './assets/menu.js'
import { ReactComponent as ArrowDown } from './assets/arrow-down.js'
import { ReactComponent as OutlineHeart } from './assets/outline-heart.js'
import { ReactComponent as FilledHeart } from './assets/filled-heart.js'
import { ReactComponent as BlueCheck } from './assets/blue-check.js'
import { ReactComponent as Arrow2Right } from './assets/arrow-2-right.js'
import { ReactComponent as AngleDown } from './assets/angle-down.js'
import { ReactComponent as ArrowSort } from './assets/arrow-sort.js'
import { ReactComponent as Search } from './assets/search.js'
import { ReactComponent as ArrowsV } from './assets/arrows-v.js'
import { ReactComponent as AngleLeft } from './assets/angle-left.js'
import { ReactComponent as AngleRight } from './assets/angle-right.js'
import { ReactComponent as List } from './assets/list.js'
import { ReactComponent as DolarSign } from './assets/dolar-sign.js'
import { ReactComponent as Calendar } from './assets/calendar.js'
import { ReactComponent as Globe } from './assets/globe.js'
import { ReactComponent as Account } from './assets/account.js'
import { ReactComponent as ExclamationMark } from './assets/exclamation-mark.js'
import { ReactComponent as MoneyWithdraw } from './assets/money-withdraw.js'
import { ReactComponent as Resize } from './assets/resize.js'
import { ReactComponent as Exchange } from './assets/exchange.js'
import { ReactComponent as Bolt } from './assets/bolt.js'
import { ReactComponent as Bell } from './assets/bell.js'
import { ReactComponent as ShoppingBag } from './assets/shopping-bag.js'
import { ReactComponent as Megaphone } from './assets/megaphone.js'
import { ReactComponent as Flame } from './assets/flame.js'
import { ReactComponent as ArrowLeft } from './assets/arrow-left.js'
import { ReactComponent as AngleUp } from './assets/angle-up.js'
import { ReactComponent as MoneyStack } from './assets/money-stack.js'
import { ReactComponent as GlitchedSign } from './assets/glitch-sign.js'

const createMaterialIcon = (Icon: ComponentType): typeof SvgIcon => {
	return createSvgIcon(createElement(Icon), Icon.displayName || 'SVGIcon')
}

export const GlitchedSignIcon = createMaterialIcon(GlitchedSign)
export const MoneyStackIcon = createMaterialIcon(MoneyStack)
export const ArrowLeftIcon = createMaterialIcon(ArrowLeft)
export const FlameIcon = createMaterialIcon(Flame)
export const AngleUpIcon = createMaterialIcon(AngleUp)
export const MegaphoneIcon = createMaterialIcon(Megaphone)
export const ShoppingBagIcon = createMaterialIcon(ShoppingBag)
export const BellIcon = createMaterialIcon(Bell)
export const BoltIcon = createMaterialIcon(Bolt)
export const ExchangeIcon = createMaterialIcon(Exchange)
export const ResizeIcon = createMaterialIcon(Resize)
export const MoneyWithdrawIcon = createMaterialIcon(MoneyWithdraw)
export const ArrowRightIcon = createMaterialIcon(ArrowRight)
export const WalletIcon = createMaterialIcon(Wallet)
export const ExternalLinkIcon = createMaterialIcon(ExternalLink)
export const DiscordIcon = createMaterialIcon(Discord)
export const MediumIcon = createMaterialIcon(Medium)
export const TelegramIcon = createMaterialIcon(Telegram)
export const TwitterIcon = createMaterialIcon(Twitter)
export const PlusIcon = createMaterialIcon(Plus)
export const MinusIcon = createMaterialIcon(Minus)
export const ArrowUpIcon = createMaterialIcon(ArrowUp)
export const InfoIcon = createMaterialIcon(Info)
export const CheckCircleIcon = createMaterialIcon(CheckCircle)
export const CheckIcon = createMaterialIcon(Check)
export const CloseIcon = createMaterialIcon(Close)
export const CopyFileIcon = createMaterialIcon(CopyFile)
export const LoginAltIcon = createMaterialIcon(LoginAlt)
export const MenuIcon = createMaterialIcon(Menu)
export const ArrowDownIcon = createMaterialIcon(ArrowDown)
export const OutlineHeartIcon = createMaterialIcon(OutlineHeart)
export const FilledHeartIcon = createMaterialIcon(FilledHeart)
export const BlueCheckIcon = createMaterialIcon(BlueCheck)
export const Arrow2RightIcon = createMaterialIcon(Arrow2Right)
export const AngleDownIcon = createMaterialIcon(AngleDown)
export const ArrowSortIcon = createMaterialIcon(ArrowSort)
export const SearchIcon = createMaterialIcon(Search)
export const ArrowsVIcon = createMaterialIcon(ArrowsV)
export const AngleLeftIcon = createMaterialIcon(AngleLeft)
export const AngleRightIcon = createMaterialIcon(AngleRight)
export const ListIcon = createMaterialIcon(List)
export const DolarSignIcon = createMaterialIcon(DolarSign)
export const CalendarIcon = createMaterialIcon(Calendar)
export const GlobeIcon = createMaterialIcon(Globe)
export const AccountIcon = createMaterialIcon(Account)
export const ExclamationMarkIcon = createMaterialIcon(ExclamationMark)
