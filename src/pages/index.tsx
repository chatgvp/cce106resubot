import { MantineProvider, createTheme } from "@mantine/core"
import App from "./_resubot"
import { useDisclosure } from "@mantine/hooks"
import { AppShell, Burger, Group, Skeleton } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
// import FeaturesImages from "./Home"
import "@mantine/notifications/styles.css"
import { ModalsProvider } from "@mantine/modals"
const theme = createTheme({
    /** Put your mantine theme override here */
})

export default function Home() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
    return (
        <MantineProvider theme={theme}>
            <ModalsProvider>
                <Notifications />
                <App />
            </ModalsProvider>
        </MantineProvider>
    )
}
