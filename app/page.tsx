"use client"
import React, {useState} from 'react'
import Image from 'next/image'
import styles from './page.module.css'
import {
  Box,
  Button,
  Divider,
  Tooltip,
  Card,
  CardContent,
  Switch,
  TextareaAutosize,
} from '@mui/material'
import {
  grey,
  red,
} from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import CampaignIcon from '@mui/icons-material/CampaignRounded';
import MessageIcon from '@mui/icons-material/MessageRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import MessagesIcon from '@mui/icons-material/ContactSupportRounded';
import DashboardIcon from '@mui/icons-material/DashboardRounded';
import HighlightIcon from '@mui/icons-material/Highlight';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Crop169Icon from '@mui/icons-material/Crop169Rounded';
import PhotoRoundedIcon from '@mui/icons-material/PhotoRounded';
import ErrorIcon from '@mui/icons-material/Error';
import useMediaQuery from '@mui/material/useMediaQuery';
import Collapse from '@mui/material/Collapse';
import {debounce, checkPendingChanges, checkForError} from './helpers';
import { MessageTemplate } from './interfaces'
//test

// Color definitions because I couldn't get customizing material UI working
const PRIMARY = 'rgba(48,127,246)'
const GREEN = 'rgba(101,183,92)'

const CHAR_LIMIT = 1024;

const MESSAGE_LAYOUT = {
  header: {
    required: false,
    sidebarDisplay: 'Header',
    canvasDisplay: 'Header',
  },
  body: {
    required: true,
    sidebarDisplay: 'Body message',
    canvasDisplay: 'Body message',
  },
  footer: {
    required: false,
    sidebarDisplay: 'Footer text',
    canvasDisplay: 'Footer',
  },
  buttons: {
    required: false,
    sidebarDisplay: 'Buttons',
    canvasDisplay: 'Buttons',
  }

}

type Template = {
  name: string,
  language: string,
  components: any[]
  namespace: string
}



const Icon = ({
  name = '',
  ...props
}) => {
  switch (name) {
  case 'settings':
    return <SettingsIcon {...props} />
  case 'close':
    return <CloseIcon {...props} />
  case 'broadcast':
    return <CampaignIcon {...props} />
  case 'message':
    return <MessageIcon {...props} />
  case 'messages':
    return <MessagesIcon {...props} />
  case 'dashboard':
    return <DashboardIcon {...props} />
  case 'highlight':
    return <HighlightIcon {...props} />
  default:
    return <DeleteIcon {...props} />
  }
}

const buildSidebarTitle = (tabName: string): string => {
  switch (tabName) {
  case 'broadcast':
  default:
    return 'Create a Campaign'
  }
}

type TabProps = {
  tabName: string,
  displayName?: string,
  selected: boolean,
  select: (value: any) => void,
}
const Tab: React.FC<TabProps> = ({
  tabName = '',
  displayName = '',
  selected = false,
  select,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '56px',
        height: '72px',
        cursor: 'pointer'
      }}
      onClick={select}
    >
      <Tooltip
        title={displayName || tabName}
        placement="right"
      >
        <Box
          sx={{
            position: 'relative',
            width: '56px',
            height: '72px',
            backgroundColor: selected ? 'black' : undefined,
          }}
        >
          {['agent', 'connectly'].includes(tabName)
            ? <Image
                width="24"
                height={tabName === 'connectly' ? "18" : "24"}
                src={`/${tabName}.png`}
                alt={tabName}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              : <Icon
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                name={tabName}
                style={{color: "#FFFFFF"}}
              />
        }
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: selected
                ? '4px'
                : 0,
              height: '72px',
              backgroundColor: PRIMARY,
              transition: 'width 300ms'
            }}
          >
          </Box>
        </Box>
      </Tooltip>
    </Box>
  )
}

const CloseButton = ({
  onClick = () => {},
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: grey[200],
        width: '36px',
        height: '36px',
        borderRadius: '18px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
    >
      <Icon
        name="close"
        sx={{
          color: grey[600],
          width: '20px',
          height: '20px',
        }}
      />
    </Box>
  )
}

type ToolbarProps = {
  activeTab: string,
  setTab: (value: any) => void,
}
const Toolbar: React.FC<ToolbarProps> = ({
  activeTab = '',
  setTab = () => {},
}) => {
  return (
    <Box
      sx={{
        width: '56px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: grey[900],
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: '0 0 100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Tab
            tabName="connectly"
            selected={activeTab === "connectly"}
            select={() => {
              console.log('GO HOME')
            }}
          />
          <Divider
            sx={{
              backgroundColor: grey[500],
            }}
          />
          <Tab
            tabName="agent"
            selected={activeTab === "agent"}
            select={() => {
              console.log('GO TO ACCOUNT')
            }}
          />
          <Divider
            sx={{
              backgroundColor: grey[500],
            }}
          />
          <Tab
            tabName="dashboard"
            selected={activeTab === "dashboard"}
            select={() => setTab("dashboard")}
          />
          <Tab
            tabName="messages"
            selected={activeTab === "messages"}
            select={() => setTab("messages")}
          />
          <Tab
            tabName="broadcast"
            selected={activeTab === "broadcast"}
            select={() => setTab("broadcast")}
          />
        </Box>
        <Tab
          tabName="settings"
          selected={activeTab === "settings"}
          select={() => {
            console.log('GO TO SETTINGS')
          }}
        />
      </Box>
    </Box>
  )
JSON}

type HeaderProps = {
  title: string,
  visible: boolean,
  close: () => void,
  showTips?: (value: any) => void,
}
const Header: React.FC<HeaderProps> = ({
  title = 'Title',
  close,
  visible,
  showTips,
}) => {
  return (
    <Collapse
      timeout={150}
      in={visible}
    >
      <Box
        sx={{
          position: 'absolute',
          userSelect: 'none',
          height: '72px',
          left: '56px',
          right: 0,
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          boxShadow: '0px 0px 8px 0px #aaa',   
          p: 3,
        }}
      >
        <p
          style={{
            color: 'black',
          }}
        >
          {title}
        </p>
        <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
        >
          {showTips &&
            <Box
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                height: '36px',
                width: 'fit-content',
                px: '14px',
                backgroundColor: 'rgb(246,248,254)',
                mr: 2,
                borderRadius: '18px',
              }}
              onClick={showTips}
            >
              <Icon
                name="highlight"
                sx={{
                  color: PRIMARY,
                }}
              />
              <p
                style={{
                  color: PRIMARY,
                  marginLeft: '4px',
                  fontSize: '12px',
                }}
              >
                Tips
              </p>
            </Box>
          }
          <Box
          >
            <CloseButton
              onClick={close}
            />
          </Box>
        </Box>
      </Box>
    </Collapse>
  )
}

const defaultMessage = {
  header: {
    included: true,
    includedTemp: true,
    url: '/header-image.png',
  },
  body: {
    included: true,
    includedTemp: true,
    message: `Hey there {{1}}!

  Are you interested in learning more about our product?`,
    messageTemp: `Hey there {{1}}!

  Are you interested in learning more about our product?`,
  },
  footer: {
    included: true,
    includedTemp: true,
    message: "Reply 'STOP' to opt out",
  },
  buttons: {
    included: true,
    includedTemp: true,
    buttons: ['Vist Site'],
  }
}

type MessageBuilderProps = {
  message: MessageTemplate,
  setMessage: (value: MessageTemplate) => void,
}
const MessageBuilder = ({
  message,
  setMessage,
}: MessageBuilderProps) => {

  const [count, setCount] = useState(message.body.messageTemp.length);
  const [error, setError] = useState('');

  const updateMessageTemp = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    newValue = newValue.slice(0, CHAR_LIMIT);
    e.target.value = newValue;
    setCount(newValue.length);
    const newMessage = JSON.parse(JSON.stringify(message))
    newMessage.body.messageTemp = newValue;
    // TODO: implement variable validation
    const newError = checkForError(newValue);
    if (newError !== error) {
      setError(newError);
    }
    setMessage(newMessage);
  };
  const handleChange = debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => updateMessageTemp(e));

  return (
    <>
      <Box
        sx={{
          position: 'relative',
        }}
      >
      <TextareaAutosize
        defaultValue={message.body.messageTemp}
        onChange={handleChange}
        style={{
          marginTop: '16px',
          minHeight: "260px",
          maxHeight: "340px",
          width: '100%',
          padding: '12px',
          paddingBottom: '25px',
          borderRadius: '10px',
          border: `1px solid ${grey[200]}`,
        }}
      />
      <p
        style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          color: grey[600],
          fontSize: '14px',
        }}>{`${count}/${CHAR_LIMIT}`}</p>
      </Box>
      {error &&
        <p
          style={{
            color: red[400],
          }}
        >
          {error}
        </p>
      }
    </>
  )
}

type MessageCardProps = {
  message: MessageTemplate,
  setMessage: (value: MessageTemplate) => void
  section: keyof MessageTemplate,
}

const MessageCard = ({
  message,
  setMessage,
  section,
}: MessageCardProps) => {
  let title: string;
  let icon: JSX.Element;
  const required = MESSAGE_LAYOUT[section].required;
  let included = false;
  let body: JSX.Element = <></>;
  switch (section) {
    case String('body'):
      title = 'Body message'
      icon = <TextFieldsIcon
        sx={{color: grey[600]}}
      />
      body = <MessageBuilder message={message} setMessage={setMessage}/>
      break;
    case String('footer'):
      title = 'Footer text'
      icon = <TextFieldsIcon
        sx={{color: grey[600]}}
      />
      break;
    case String('buttons'):
      title = 'Buttons'
      icon = <Crop169Icon
        sx={{color: grey[600]}}
      />
      break;
    case String('header'):
      title = 'Header'
      icon = <PhotoRoundedIcon
        sx={{color: grey[600]}}
      />
      break;
    default:
      title = section[0].toUpperCase() + section.slice(1);
      break;
  }

  const CardHeader = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '26px',
        }}
      >
        <Box
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
          <p
            style={{
              color: 'black',
              marginLeft: '6px',
            }}
          >
            {title}
          </p>
          <Tooltip
            title={`Info about ${title}`}
            placement="top"
          >
            <ErrorIcon
              sx={{
                width: '16px',
                height: '16px',
                color: grey[500],
                ml: '2px',
              }}
            />
          </Tooltip>
          {required &&
            <Box
              sx={{
                ml: '4px',
                color: 'black',
                paddingX: '8px',
                borderRadius: '4px',
                fontSize: '10px',
                height: '28px',
                lineHeight: '28px',
                backgroundColor: grey[200],
                fontWeight: 'bold',
              }}
            >
              REQUIRED
            </Box>
          }
        </Box>
        {!required &&
          <Switch
            checked={message[section].includedTemp}
            onChange={() => {
              const newMessage: MessageTemplate = JSON.parse(JSON.stringify(message))
              newMessage[section].includedTemp = !newMessage[section].includedTemp
              setMessage(newMessage)
            }}
          />
        }
      </Box>
    )
  }

  return (
    <Card
      sx={{
        flex: '0 0 auto',
        my: 1,
        boxShadow: 'none',
        border: `1px solid ${grey[300]}`,
        borderRadius: '10px',
        padding: '16px 24px 16px 24px',
      }}
    >
      <CardHeader />
      {body}
    </Card>
  )
}

type SidebarProps = {
  message: MessageTemplate,
  visible: boolean,
  mobile: boolean,
  setMessage: (value: MessageTemplate) => void,
  close: () => void,
}
const Sidebar: React.FC<SidebarProps> = ({
  message = defaultMessage,
  mobile = false,
  visible = false,
  setMessage = (value: MessageTemplate) => {},
  close = () => {},
}) => {
  const hasChangesPending = checkPendingChanges(message);

  const saveMessage = () => {
    const newMessage = JSON.parse(JSON.stringify(message));
    const componentsList: any[] = [];
    const messageTemp = newMessage.body.messageTemp;
    Object.entries(newMessage).forEach(entry => {
      const componentType = entry[0];
      const included = newMessage[componentType].includedTemp;
      newMessage[entry[0]].included = included;
      if (included) {
        const componentObject: {[key: string]: any} = {
          type: entry[0],
        }
        if (componentType === 'header') {
          componentObject.url = message[componentType].url;
        } else if (componentType === 'body') {
          componentObject.parameters = [];
          componentObject.message = messageTemp;
        } else if (componentType === 'footer') {
          componentObject.message = message[componentType].message;
        } else if (componentType === 'buttons') {
          componentObject.buttons = message.buttons.buttons;
        }
        componentsList.push(componentObject)
      }
    })
    newMessage.body.message = messageTemp;
    setMessage(newMessage);

    const template: Template = {
      name: 'Message Example',
      language: 'en',
      components: componentsList,
      namespace: '',
    }
    console.log('MESSAGE TEMPLATE', template)
  }
  const cancelChanges = () => {
    const newMessage = JSON.parse(JSON.stringify(message));
    Object.entries(newMessage).forEach(entry => {
      newMessage[entry[0]].includedTemp = newMessage[entry[0]].included;
    })
    newMessage.body.messageTemp = newMessage.body.message;
    setMessage(newMessage);
  }
  const deleteMessage = () => {
    console.log('DELETE MESSAGE');
  }

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        flex: visible
          ? (mobile ? '1 1 100%' : '0 0 360px')
          : '0 0 0',
        display: 'flex',
        flexDirection: 'column',
        width: mobile ? '100%': '360px',
        transition: 'flex 200ms',
        borderRight: `2px solid ${grey[200]}`,
        height: '100vh',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          flex: '1 1 auto',
          minHeight: 0,
          display: visible ? 'flex' : 'none',
          flexDirection: 'column',
          width: '100%',
          px: 3,
          pb: 0,
          pt: 10,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '0 0 auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 3,
            }}
          >
            <p
              style={{
                color: 'black',
                fontSize: '24px',
              }}
            >
              Edit Message
            </p>
            <CloseButton
              onClick={close}
            />
          </Box>
          <p
            style={{
              color: 'black',
              fontSize: '16px',
              paddingBottom: '8px',
            }}
          >
          Content
          </p>
        </Box>
        <Box
          sx={{
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
          }}
        >
          <MessageCard
            message={message}
            setMessage={setMessage}
            section="header"
          />
          <MessageCard
            message={message}
            setMessage={setMessage}
            section="body"
          />
          <MessageCard
            message={message}
            setMessage={setMessage}
            section="footer"
          />
          <MessageCard
            message={message}
            setMessage={setMessage}
            section="buttons"
          />
        </Box>
      </Box>
      <Divider
        sx={{
          backgroundColor: grey[200],
          display: visible ? 'flex' : 'none',
        }}
      />
      <Box
        sx={{
          flex: '0 0 132px',
          display: visible ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 3,
        }}

      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: PRIMARY
          }}
          onClick={saveMessage}
          disabled={!hasChangesPending}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            color: PRIMARY
          }}
          disabled={!hasChangesPending}
          onClick={hasChangesPending ? cancelChanges : deleteMessage}
        >
          {hasChangesPending
            ? 'Revert Changes'
            : 'Delete'}
        </Button>
      </Box>
    </Box>
  )
}

type BadgeProps = {
  content: string,
  backgroundColor: string,
  sx?: {[property: string]: string},
}
const Badge = ({
  content = 'Header',
  backgroundColor = 'white',
  sx = {},
}: BadgeProps) => {
  return (
    <Box
      sx={{
        ...sx,
        backgroundColor: backgroundColor,
        borderRadius: '4px',
        px: '12px',
        py: '4px',
        height: '28px',
        width: 'fit-content',
        mb: '6px',
      }}
    >
      <p
        style={{
          color: GREEN,
          margin: 'auto',
          fontSize: '12px',
          lineHeight: '19.92px',
        }}
      >
        {content}
      </p>
    </Box>
  )
}

// Sample message output
const Message = ({
  message = defaultMessage,
  showSidebar = () => {}
}) => {
  const hasChangesPending = checkPendingChanges(message);
  return (
    <Box
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        width: '304px',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0px 0px 4px #aaa',   
        userSelect: "none",
      }}
      onClick={showSidebar}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '8px',
          flex: '0 0 32px',
        }}
      >
        <Box
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "rgb(123,135,198)",
            mr: 1,
          }}
        >
          <Icon
            name="message"
            sx={{
              color: "white",
            }}
          />
        </Box>
        <p
          style={{
            color: 'black',
          }}
        >
          Message Example
        </p>
        {hasChangesPending && 
        <p
          style={{
            color: grey[500],
            fontSize: '12px',
            marginLeft: '5px'
          }}
        >
          Pending
        </p>
        }
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 2,
          padding: '23.56px',
          flex: '1 1 100%',
          backgroundColor: grey[100],
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            p: '6.44px',
            flex: '1 1 100%',
            backgroundColor: 'white',
            borderRadius: '8px',
          }}
        >
          {message.header.includedTemp && <><Image
            src={message.header.url}
            alt="header image"
            width="220"
            height="110"
          />

          <Badge
            content={MESSAGE_LAYOUT.header.canvasDisplay}
            backgroundColor="white"
            sx={{
              position: 'absolute',
              top: '15px',
              left: '15px',
            }}
          />
          <Divider
            sx={{
              my: '6.44px',
              borderBottom: '1px dashed rgba(101,183,92)',
            }}
          /></>}
          <Badge
            content={MESSAGE_LAYOUT.body.canvasDisplay}
            backgroundColor={grey[100]}
          />
          <p
            style={{
              color: 'black',
              fontSize: '14px',
            }}
          >
            {message.body.messageTemp}
          </p>
          {message.footer.includedTemp && <>
          <Divider
            sx={{
              my: '6.44px',
              borderBottom: '1px dashed rgba(101,183,92)',
            }}
          />
          <Badge
            content={MESSAGE_LAYOUT.footer.canvasDisplay}
            backgroundColor={grey[100]}
          />
          <p
            style={{
              color: grey[600],
              fontSize: '14px',
            }}
          >
            {message.footer.message}
          </p>
          </>}
          {message.buttons.includedTemp && <>
          <Divider
            sx={{
              my: '6.44px',
              borderBottom: '1px dashed rgba(101,183,92)',
            }}
          />
          <Badge
            content={MESSAGE_LAYOUT.buttons.canvasDisplay}
            backgroundColor={grey[100]}
          />
          {message.buttons.buttons.map((value, i) => {
            return (
              <Button
                key={`button-${i}`}
                variant="outlined"
                sx={{
                  my: 1,
                  color: GREEN,
                  borderColor: GREEN,
                }}
              >
                {value}
              </Button>
            )
          })}
          </>}
        </Box>
        <Button
          variant="text"
          sx={{
            mt: 1,
            backgroundColor: 'white',
            textTransform: 'none',
          }}
        >
          Talk to a Styling Expert
        </Button>
      </Box>
    </Box>
  )
}

// Drag and drop area. Contains sample message
const Canvas = ({
  message = defaultMessage,
  showSidebar = () => {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1 1 100%',
        height: '100%',
        backgroundColor: 'rgb(250,252,255)',
      }}
    >
      <Message message={message} showSidebar={showSidebar}/>
    </Box>
  )
}

export default function Home() {
  const [tab, setTab] = useState("broadcast")
  const [template, setTemplate] = useState(defaultMessage)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const mobile = useMediaQuery('(max-width:599px)');

  return (
    <main className={styles.main}>
      <Toolbar
        activeTab={tab}
        setTab={setTab}
      />
      <Header
        title={buildSidebarTitle(tab)}
        close={() => {setTab("")}}
        visible={tab === 'broadcast'}
        showTips={() => console.log('SHOW TIPS')}
      />
      <Sidebar
        mobile={mobile}
        message={template}
        setMessage={setTemplate}
        visible={tab === 'broadcast' && sidebarOpen}
        close={() => {setSidebarOpen(false)}}
      />
      {(!mobile || !sidebarOpen) &&
      <Canvas
        message={template}
        showSidebar={() => {setSidebarOpen(true)}}
      />}
    </main>
  )
}
