import {
    Paper,
    Text,
    Spoiler,
    Container,
    Button,
    Skeleton,
    Title,
    Badge,
    Group,
    ThemeIcon,
    Avatar,
    Flex,
    TextInput,
    rem,
    Center,
    Modal,
    Menu,
    ActionIcon,
    Textarea,
    Stack,
    CloseButton,
    SimpleGrid,
    Anchor,
} from "@mantine/core"
import { modals, useModals } from "@mantine/modals"
import classes from "../styles/CardGradient.module.css"
import { SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import {
    IconBriefcase,
    IconChevronRight,
    IconDots,
    IconDownload,
    IconEdit,
    IconHeart,
    IconLogout,
    IconMessage,
    IconNote,
    IconPlayerPause,
    IconSearch,
    IconSettings,
    IconStar,
    IconSwitchHorizontal,
    IconTrash,
    IconUser,
} from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { useDisclosure } from "@mantine/hooks"
export default function AnalyzedResume() {
    interface ResumeData {
        job_title: string
        job_qualifications: string
        note: string
        pdf_url: string
        candidate1: {
            name: string

            qualification_percentage: string
            strengths: string[]
            weaknesses: string[]
        }
        summary: string
    }
    const [data, setData] = useState<ResumeData>()
    const [isLoading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const fetchDataRef = useRef<() => Promise<void>>(async () => {})

    const deleteData = useCallback(async (key: string) => {
        try {
            const response = await axios.delete(
                `https://cce106resubot-backend.onrender.com/delete?key=${key}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            if (response.status === 200) {
                notifications.show({
                    withCloseButton: true,
                    autoClose: 3000,
                    title: "Deleted Successfully",
                    message:
                        "The data has been successfully removed from the database.",
                    color: "red",
                    loading: false,
                })
                fetchDataRef.current()
            } else {
                console.error(
                    `Error deleting data. Status code: ${response.status}`
                )
            }
        } catch (error) {
            console.error(error)
            console.log("Error deleting data")
        }
    }, [])
    const handleSearchInputChange = (event: {
        target: { value: SetStateAction<string> }
    }) => {
        setSearchQuery(event.target.value)
        console.log(event.target.value)
    }
    const filteredData = data
        ? Object.values(data).filter((candidateData) =>
              Object.values(candidateData)
                  .join(" ")
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
          )
        : []
    const [newNote, setNote] = useState("")
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios
                    .get("https://cce106resubot-backend.onrender.com/get")
                    .then(function (response) {
                        setData(response.data)
                    })
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        fetchDataRef.current = fetchData
        fetchData()

        console.log("newNote:", newNote)
    }, [searchQuery, newNote])

    // const [noteChange, setNoteChange] = useState("")
    // const handleUpdateNoteChange = (event: {
    //     target: { value: SetStateAction<string> }
    // }) => {
    //     const newValue = event.target.value
    //     setNoteChange(newValue)
    //     console.log("newValue:", newValue)
    //     console.log("noteChange:", noteChange)
    // }

    const noteChangeRef = useRef("")

    const handleUpdateNoteChange = (event: { target: { value: any } }) => {
        const newValue = event.target.value
        noteChangeRef.current = newValue
        console.log("newValue:", newValue)
        console.log("noteChange:", noteChangeRef.current)
    }
    const openEditModal = (key: string, note: string) => {
        modals.openConfirmModal({
            title: <b>Applicant Note</b>,
            centered: true,
            size: "md",
            labels: { confirm: "Save", cancel: "Cancel" },
            onConfirm: () => updateData(key, noteChangeRef.current),
            children: (
                <div>
                    <Textarea
                        size="md"
                        radius="md"
                        description="Add note to this candidate"
                        defaultValue={note}
                        autosize
                        minRows={4}
                        onChange={handleUpdateNoteChange}
                    />
                </div>
            ),
        })
    }
    const updateData = async (key: string, newValue: string) => {
        try {
            const response = await axios.post(
                `https://cce106resubot-backend.onrender.com/update?key=${key}&new_note=${newValue}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            console.log(response)
            if (response.status === 200) {
                notifications.show({
                    withCloseButton: true,
                    autoClose: 3000,
                    title: "Update Success",
                    message: "note updated successfully",
                    color: "green",
                    loading: false,
                })
                fetchDataRef.current()
            } else {
                console.error(
                    `Error updating data. Status code: ${response.status}`
                )
            }
        } catch (error) {
            console.error(error)
            console.log("Error")
        }
    }

    const openModal = (candidateData: ResumeData) =>
        modals.open({
            centered: true,
            title: "Please confirm your action",
            size: "xl",
            children: (
                <div>
                    <Group>
                        <ThemeIcon variant="transparent" size={60} radius="xl">
                            <IconUser
                                style={{
                                    width: "50%",
                                    height: "50%",
                                }}
                            />
                        </ThemeIcon>
                        <div>
                            <Text
                                fw={700}
                                fz="lg"
                                className={classes.itemTitle}>
                                Application Name
                            </Text>
                            <Text c="dimmed">
                                {candidateData.candidate1.name}
                            </Text>
                        </div>
                    </Group>
                    <Group>
                        <ThemeIcon variant="transparent" size={60} radius="xl">
                            <IconBriefcase
                                style={{
                                    width: "50%",
                                    height: "50%",
                                }}
                            />
                        </ThemeIcon>
                        <div>
                            <Text fw={700} fz="lg">
                                Job Applied
                            </Text>
                            <Text c="dimmed">{candidateData.job_title}</Text>
                        </div>
                    </Group>
                    <Text fw={700} fz="lg">
                        Summary
                    </Text>
                    <Text size="sm" mt="sm" c="dimmed">
                        {candidateData.summary}
                    </Text>
                    <Text fw={700} fz="lg">
                        Qualifications
                    </Text>
                    <Badge
                        color={
                            candidateData.candidate1.qualification_percentage.toLowerCase() ===
                            "average"
                                ? "yellow"
                                : candidateData.candidate1.qualification_percentage.toLowerCase() ===
                                  "low"
                                ? "orange"
                                : candidateData.candidate1.qualification_percentage.toLowerCase() ===
                                  "very low"
                                ? "red"
                                : candidateData.candidate1.qualification_percentage.toLowerCase() ===
                                  "high"
                                ? "lime"
                                : candidateData.candidate1.qualification_percentage.toLowerCase() ===
                                  "very high"
                                ? "green"
                                : undefined // No default color
                        }>
                        {candidateData.candidate1.qualification_percentage}
                    </Badge>
                    <Text size="sm" mt="sm" fw={700}>
                        Strengths
                    </Text>
                    <Text size="sm" mt="sm" c="dimmed">
                        {candidateData.candidate1.strengths.join(", ")}
                    </Text>
                    <Text size="sm" mt="sm" fw={700}>
                        Weaknesses
                    </Text>
                    <Text size="sm" mt="sm" c="dimmed">
                        {candidateData.candidate1.weaknesses.join(", ")}
                    </Text>
                    <Flex
                        mih={50}
                        gap="md"
                        justify="flex-start"
                        align="center"
                        direction="row"
                        wrap="nowrap">
                        <Anchor
                            href={candidateData.pdf_url}
                            download="resume.pdf"
                            style={{ textDecoration: "none" }}>
                            <Button
                                rightSection={<IconDownload size={14} />}
                                variant="light">
                                Download Resume
                            </Button>
                        </Anchor>
                    </Flex>
                </div>
            ),
        })
    const openDeleteModal = (key: string, name: string) =>
        modals.openConfirmModal({
            title: "Confirm Deletion",
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete <b>{name}</b>'s data? This
                    action will not be undone and permanently deleted from the
                    database.
                </Text>
            ),
            labels: { confirm: "Delete", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onCancel: () => console.log("Canceled"),
            onConfirm: () => deleteData(key),
        })
    return (
        <>
            <Container size="sm" className={classes.wrapper}>
                <Title ta="center" className={classes.title} pb="xl">
                    <span className={classes.highlight}>Analyzed</span>
                    Resume
                </Title>
                <TextInput
                    placeholder="Search by any field"
                    mb="md"
                    leftSection={
                        <IconSearch
                            style={{ width: rem(16), height: rem(16) }}
                            stroke={1.5}
                        />
                    }
                    onChange={handleSearchInputChange}
                />
            </Container>
            {isLoading ? (
                <Container>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Paper
                            withBorder
                            radius="md"
                            className={classes.card}
                            key={index}
                            style={{
                                margin: "10px",
                            }}>
                            <Skeleton height={50} mt={6} radius="xl" />
                            <Skeleton height={50} mt={6} radius="xl" />
                            <Skeleton height={8} mt={6} radius="xl" />
                            <Skeleton height={8} mt={6} radius="xl" />
                        </Paper>
                    ))}
                </Container>
            ) : filteredData.length === 0 ? (
                <Center>No searches found</Center>
            ) : (
                <Container size="md">
                    {data &&
                        filteredData.map((candidateData, index) => (
                            <Paper
                                key={index}
                                withBorder
                                radius="md"
                                className={classes.card}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    margin: "20px",
                                }}>
                                <Flex
                                    justify="flex-start"
                                    align="center"
                                    direction="row">
                                    <SimpleGrid
                                        cols={2}
                                        onClick={() =>
                                            openModal(candidateData)
                                        }>
                                        <Paper p="sm" radius="md" shadow="md">
                                            <Text fz="md" fw={500}>
                                                Note*
                                            </Text>
                                            <Text c="dimmed" fz="xs">
                                                {candidateData.note}
                                            </Text>
                                        </Paper>
                                        <Group>
                                            <Group>
                                                <ThemeIcon
                                                    variant="transparent"
                                                    size={60}
                                                    radius="xl">
                                                    <IconUser
                                                        style={{
                                                            width: "50%",
                                                            height: "50%",
                                                        }}
                                                    />
                                                </ThemeIcon>
                                                <div>
                                                    <Text
                                                        fw={700}
                                                        size="lg"
                                                        className={
                                                            classes.itemTitle
                                                        }>
                                                        Application Name
                                                    </Text>
                                                    <Text c="dimmed">
                                                        {
                                                            candidateData
                                                                .candidate1.name
                                                        }
                                                    </Text>
                                                </div>
                                            </Group>

                                            <Group>
                                                {" "}
                                                <ThemeIcon
                                                    variant="transparent"
                                                    size={60}
                                                    radius="xl">
                                                    <IconBriefcase
                                                        style={{
                                                            width: "50%",
                                                            height: "50%",
                                                        }}
                                                    />
                                                </ThemeIcon>
                                                <div>
                                                    <Text fw={700} size="lg">
                                                        Job Applied
                                                    </Text>
                                                    <Text c="dimmed">
                                                        {
                                                            candidateData.job_title
                                                        }
                                                    </Text>
                                                </div>
                                            </Group>
                                        </Group>
                                    </SimpleGrid>
                                </Flex>

                                <Menu
                                    withArrow
                                    width={200}
                                    position="bottom"
                                    transitionProps={{ transition: "pop" }}
                                    withinPortal>
                                    <Menu.Target>
                                        <ActionIcon variant="default">
                                            <IconDots
                                                style={{
                                                    width: rem(16),
                                                    height: rem(16),
                                                }}
                                                stroke={1.5}
                                            />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Settings</Menu.Label>
                                        <Menu.Item
                                            onClick={() => {
                                                setNote(candidateData.note)
                                                openEditModal(
                                                    Object.keys(data)[index],
                                                    candidateData.note
                                                )
                                            }}
                                            leftSection={
                                                <IconEdit
                                                    style={{
                                                        width: rem(16),
                                                        height: rem(16),
                                                    }}
                                                    stroke={1.5}
                                                />
                                            }>
                                            Edit note
                                        </Menu.Item>
                                        <Menu.Item
                                            color="red"
                                            onClick={() =>
                                                openDeleteModal(
                                                    Object.keys(data)[index],
                                                    candidateData.candidate1
                                                        .name
                                                )
                                            }
                                            leftSection={
                                                <IconTrash
                                                    style={{
                                                        width: rem(16),
                                                        height: rem(16),
                                                    }}
                                                    stroke={1.5}
                                                />
                                            }>
                                            Delete
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Paper>
                        ))}
                </Container>
            )}
        </>
    )
}
