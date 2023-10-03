import axios from "axios"
import {
    Button,
    Container,
    TextInput,
    Textarea,
    Badge,
    Paper,
    List,
    ListItem,
    Text,
    Title,
    rem,
    FileButton,
    Center,
    Flex,
    Loader,
    Group,
    SimpleGrid,
} from "@mantine/core"
import { SetStateAction, useEffect, useRef, useState } from "react"
import drop from "../styles/DropzoneButton.module.css"
import classes from "../styles/FloatingLabelInput.module.css"
import {
    IconCloudUpload,
    IconArrowRight,
    IconFileText,
    IconBrandGithub,
    IconBrandOpenai,
} from "@tabler/icons-react"
// import { GithubIcon } from "@mantine/ds"
import { notifications } from "@mantine/notifications"

export default function Home() {
    interface ResumeData {
        job_title: string
        job_qualifications: string
        pdf_url: string
        candidate1: {
            name: string
            qualification_percentage: string
            strengths: string[]
            weaknesses: string[]
        }
        summary: string
    }
    const initialData = {
        job_title: "",
        job_qualifications: "",
        pdf_url: "",
        candidate1: {
            name: "",
            qualification_percentage: "",
            strengths: [],
            weaknesses: [],
        },
        summary: "",
    }
    const [jobTitle, setJobTitle] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<ResumeData | null>(null)
    const [showResults, setShowResults] = useState(false)

    const handleJobTitleChange = (event: {
        target: { value: SetStateAction<string> }
    }) => {
        setJobTitle(event.target.value)
    }

    const handleJobDescriptionChange = (event: {
        target: { value: SetStateAction<string> }
    }) => {
        setJobDescription(event.target.value)
    }

    // const handleFileChange = (files: File[]) => {
    //     setSelectedFile(files)
    // }

    const handleAnalyzeClick = async () => {
        if (file && jobTitle && jobDescription) {
            const formData = new FormData()
            formData.append("candidate1", file)
            formData.append("job_title", jobTitle)
            formData.append("job_qualifications", jobDescription)
            setLoading(true)
            setShowResults(false)
            axios
                .post("http://127.0.0.1:8000/add", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        accept: "application/json",
                    },
                })
                .then(function (response) {
                    if (response.status === 200) {
                        setData(response.data)
                        setLoading(false)
                        setShowResults(true)
                        notifications.show({
                            withCloseButton: true,
                            autoClose: 5000,
                            title: "Analyzed Successfully",
                            message:
                                "The resume has been added in the Analyzed Resume section.",
                            color: "blue",
                            loading: false,
                        })
                    } else {
                        // Handle the error condition
                        console.log("Error:", response.statusText)
                        notifications.show({
                            withCloseButton: true,
                            autoClose: 5000,
                            title: "An error occurred",
                            message: "Oops, there is something wrong",
                            color: "red",
                            loading: false,
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error)
                    notifications.show({
                        withCloseButton: true,
                        autoClose: 5000,
                        title: "An error occurred",
                        message: "Oops, there is something wrong",
                        color: "red",
                        loading: false,
                    })
                })
        } else {
            console.error("No file selected")
            notifications.show({
                withCloseButton: true,
                autoClose: 5000,
                title: "An error occurred",
                message: "Oops, there is something wrong",
                color: "red",
                loading: false,
            })
        }
    }
    return (
        <Container size="lg" style={{ padding: "20px" }}>
            <Center>
                <SimpleGrid cols={2}>
                    <div>
                        <Title className={classes.title}>
                            An{" "}
                            <Text
                                component="span"
                                variant="gradient"
                                gradient={{ from: "blue", to: "cyan" }}
                                inherit>
                                AI-Powered
                            </Text>{" "}
                            Resume Analysis
                        </Title>
                        <Text className={classes.description} c="dimmed">
                            ResuBot utilizes AI technology to thoroughly assess
                            resumes, providing valuable insights that assist
                            recruiters in making informed decisions and
                            streamlining their recruitment processes.
                        </Text>
                    </div>

                    <Paper
                        withBorder
                        radius="md"
                        style={{
                            position: "relative",
                            marginBottom: rem(30),
                            padding: rem(30),
                            width: "65%",
                        }}>
                        <Flex
                            mih={50}
                            gap="xs"
                            justify="center"
                            align="center"
                            direction="column"
                            wrap="wrap">
                            <IconCloudUpload
                                style={{ width: rem(50), height: rem(50) }}
                                stroke={1.5}
                            />
                            <Text fw={700}>Upload resume</Text>
                            <Text ta="center" fz="sm" mt="xs" c="dimmed">
                                We only accept <i>.pdf</i> files.
                            </Text>
                            {file && (
                                <Text size="sm" ta="center" mt="sm">
                                    file: {file.name}
                                </Text>
                            )}
                        </Flex>
                        <FileButton onChange={setFile}>
                            {(props) => (
                                <Button
                                    {...props}
                                    className={drop.control}
                                    radius="xl">
                                    Select File
                                </Button>
                            )}
                        </FileButton>
                    </Paper>
                </SimpleGrid>
            </Center>
            <TextInput
                label="Job Title"
                placeholder="Enter job title"
                id="jobTitle" // Add id attribute
                value={jobTitle}
                onChange={handleJobTitleChange}
                style={{
                    margin: "1rem auto",
                    display: "block",
                    width: "100%",
                }}
                withAsterisk
                required
            />
            <Textarea
                label="Job Description"
                id="jobDescription" // Add id attribute
                placeholder="Enter job description"
                autosize
                minRows={3}
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                withAsterisk
                required
            />
            <Button
                mt="xl"
                disabled={loading}
                onClick={handleAnalyzeClick}
                variant="light"
                leftSection={<IconFileText size={14} />}
                rightSection={
                    loading ? (
                        <Loader color="blue" size="sm" type="dots" />
                    ) : (
                        <IconArrowRight size={14} />
                    )
                }>
                {loading ? "Analyzing" : "Analyze Resume"}
            </Button>
            {showResults && (
                <div>
                    <Flex
                        mih={50}
                        gap="xs"
                        justify="center"
                        align="center"
                        direction="column"
                        wrap="wrap">
                        <Title order={2}>
                            Resume{" "}
                            <span className={classes.highlight}>
                                Analyzation
                            </span>{" "}
                            Result
                        </Title>
                        <div>
                            <Text
                                fw={700}
                                fz="lg"
                                className={classes.itemTitle}>
                                Summary
                            </Text>
                            <Text c="dimmed">{data?.summary}</Text>
                        </div>
                    </Flex>
                    <Flex
                        mih={50}
                        gap="sm"
                        justify="center"
                        align="flex-start"
                        direction="column"
                        wrap="wrap">
                        <div className={classes.item}>
                            <div>
                                <Text
                                    fw={700}
                                    fz="lg"
                                    className={classes.itemTitle}>
                                    Qualifications
                                </Text>
                                <Badge
                                    color={
                                        data?.candidate1?.qualification_percentage.toLowerCase() ===
                                        "average"
                                            ? "yellow"
                                            : data?.candidate1?.qualification_percentage.toLowerCase() ===
                                              "low"
                                            ? "orange"
                                            : data?.candidate1?.qualification_percentage.toLowerCase() ===
                                              "very low"
                                            ? "red"
                                            : data?.candidate1?.qualification_percentage.toLowerCase() ===
                                              "high"
                                            ? "lime"
                                            : data?.candidate1?.qualification_percentage.toLowerCase() ===
                                              "very high"
                                            ? "green"
                                            : undefined
                                    }
                                    style={{ textTransform: "uppercase" }}>
                                    {data?.candidate1?.qualification_percentage}
                                </Badge>
                            </div>
                        </div>
                        <div className={classes.item}>
                            <span>
                                <Text
                                    fw={700}
                                    fz="lg"
                                    className={classes.itemTitle}>
                                    Strengths
                                </Text>
                            </span>
                            <div>
                                <List>
                                    {data?.candidate1?.strengths.map(
                                        (strength, index) => (
                                            <Text c="dimmed" key={index}>
                                                <ListItem>{strength}</ListItem>
                                            </Text>
                                        )
                                    )}
                                </List>
                            </div>
                        </div>
                        <div className={classes.item}>
                            <div>
                                <Text
                                    fw={700}
                                    fz="lg"
                                    className={classes.itemTitle}>
                                    Weaknesses
                                </Text>
                                <List>
                                    {data?.candidate1?.weaknesses.map(
                                        (strength, index) => (
                                            <Text c="dimmed" key={index}>
                                                <ListItem>{strength}</ListItem>
                                            </Text>
                                        )
                                    )}
                                </List>
                            </div>
                        </div>
                    </Flex>
                </div>
            )}
        </Container>
    )
}
