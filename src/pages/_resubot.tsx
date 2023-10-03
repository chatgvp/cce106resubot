import { useDisclosure } from "@mantine/hooks"
import cx from "clsx"
import {
    ActionIcon,
    Anchor,
    AppShell,
    Burger,
    Container,
    Group,
    UnstyledButton,
    rem,
    useMantineColorScheme,
    useComputedColorScheme,
    Title,
    ThemeIcon,
} from "@mantine/core"
import classes from "../styles/DoubleNavbar.module.css"
import title from "../styles/FloatingLabelInput.module.css"
import { useState } from "react"
import Home from "./_home"
import AnalyzedResume from "./_analyzedResume"
import {
    IconBrandMantine,
    IconBrandOpenai,
    IconFileDescription,
    IconHome,
    IconMoon,
    IconPaperclip,
    IconPhoto,
    IconSun,
} from "@tabler/icons-react"
// import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core"
export default function App() {
    const [opened, { toggle }] = useDisclosure()
    const [active, setActive] = useState("Home") // Set "Home" as the default active link
    const data = [
        { link: "Home", label: "Home", icon: <IconHome /> },
        {
            link: "AnalyzedResume",
            label: "Analyzed Resume",
            icon: <IconFileDescription />,
        },
    ]

    const handleLinkClick = (item: { link?: string; label: any }) => {
        setActive(item.label)
    }

    const links = data.map((item) => (
        <UnstyledButton
            className={classes.link}
            data-active={item.label === active || undefined}
            key={item.label}
            onClick={() => handleLinkClick(item)}>
            <Group>
                {item.icon}
                {item.label}
            </Group>
        </UnstyledButton>
    ))

    const renderActiveComponent = () => {
        switch (active) {
            case "Home":
                return <Home />
            case "Analyzed Resume":
                return <AnalyzedResume />
            default:
                return null
        }
    }

    const { setColorScheme } = useMantineColorScheme()
    const computedColorScheme = useComputedColorScheme("light", {
        getInitialValueInEffect: true,
    })
    return (
        <AppShell
            header={{ height: { base: 80 } }}
            navbar={{
                width: { base: 200, md: 300, lg: 400 },
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            padding="md">
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Title className={title.title}>
                        ResuB
                        {/* <ThemeIcon radius="md" size="lg" color="blue">
                            <IconBrandOpenai />
                        </ThemeIcon> */}
                        ot
                    </Title>
                    <Group justify="center">
                        <ActionIcon
                            onClick={() =>
                                setColorScheme(
                                    computedColorScheme === "light"
                                        ? "dark"
                                        : "light"
                                )
                            }
                            variant="default"
                            size="xl"
                            aria-label="Toggle color scheme">
                            {computedColorScheme === "light" ? (
                                <IconMoon
                                    className={cx(classes.icon, classes.light)}
                                    stroke={1.5}
                                />
                            ) : (
                                <IconSun
                                    className={cx(classes.icon, classes.dark)}
                                    stroke={1.5}
                                />
                            )}
                        </ActionIcon>
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">{links} </AppShell.Navbar>
            <AppShell.Main
                style={{ paddingBottom: "200px", paddingTop: "150px" }}>
                {renderActiveComponent()}
            </AppShell.Main>
        </AppShell>
    )
}
