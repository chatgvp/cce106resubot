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
} from "@mantine/core"
import classes from "../styles/CardGradient.module.css"
import { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import { IconBriefcase, IconDownload, IconUser } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { stat } from "fs"
export default function AnalyzedResume() {
    interface ResumeData {
        job_title: string
        job_qualifications: string
        candidate1: {
            name: string
            pdf_url: string
            qualification_percentage: string
            strengths: string[]
            weaknesses: string[]
        }
        summary: string
    }
    const [data, setData] = useState<ResumeData>()
    const [isLoading, setLoading] = useState(true)
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
    }, []) // Empty dependency array since deleteData doesn't depend on any external variables or props

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios
                    .get("https://cce106resubot-backend.onrender.com/get")
                    .then(function (response) {
                        setData(response.data)
                        // console.log(response)
                    })
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        fetchDataRef.current = fetchData
        fetchData()
    }, [])

    return (
        <>
            <Container size="sm" className={classes.wrapper}>
                <Title ta="center" className={classes.title}>
                    <span className={classes.highlight}>Analyzed</span>
                    Resume
                </Title>
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
                            <Skeleton height={8} mt={6} radius="xl" />
                            <Skeleton height={8} mt={6} radius="xl" />
                            <Skeleton height={8} mt={6} radius="xl" />
                            <Skeleton height={8} mt={6} radius="xl" />
                            <Skeleton height={8} mt={6} radius="xl" />
                            <Skeleton height={8} mt={6} radius="xl" />
                            <Skeleton height={8} mt={6} radius="xl" />
                        </Paper>
                    ))}
                </Container>
            ) : (
                <Container>
                    {data &&
                        Object.values(data).map((candidateData, index) => (
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
                                <Spoiler
                                    maxHeight={120}
                                    showLabel="Show more"
                                    hideLabel="Hide">
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
                                            <Text fw={700} fz="lg">
                                                Job Applied
                                            </Text>
                                            <Text c="dimmed">
                                                {candidateData.job_title}
                                            </Text>
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
                                        {
                                            candidateData.candidate1
                                                .qualification_percentage
                                        }
                                    </Badge>
                                    <Text size="sm" mt="sm" fw={700}>
                                        Strengths
                                    </Text>
                                    <Text size="sm" mt="sm" c="dimmed">
                                        {candidateData.candidate1.strengths.join(
                                            ", "
                                        )}
                                    </Text>
                                    <Text size="sm" mt="sm" fw={700}>
                                        Weaknesses
                                    </Text>
                                    <Text size="sm" mt="sm" c="dimmed">
                                        {candidateData.candidate1.weaknesses.join(
                                            ", "
                                        )}
                                    </Text>
                                    <Flex
                                        mih={50}
                                        gap="md"
                                        justify="flex-start"
                                        align="center"
                                        direction="row"
                                        wrap="nowrap">
                                        <a
                                            href={candidateData.pdf_url}
                                            download="resume.pdf"
                                            style={{ textDecoration: "none" }}>
                                            <Button
                                                variant="light"
                                                rightSection={
                                                    <IconDownload size={14} />
                                                }>
                                                Download Resume
                                            </Button>
                                        </a>
                                    </Flex>
                                </Spoiler>
                                <Button
                                    variant="outline"
                                    color="red"
                                    onClick={() =>
                                        deleteData(Object.keys(data)[index])
                                    }>
                                    Delete
                                </Button>
                            </Paper>
                        ))}
                </Container>
            )}
        </>
    )
}
