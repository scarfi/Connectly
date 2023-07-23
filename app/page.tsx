"use client"
import React, {useState, useReducer, useMemo} from 'react'
import Image from 'next/image'
import styles from './page.module.css'
import {
  Box,
  Button,
  Divider,
  Tooltip,
  Card,
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
import {debounce, checkPendingChanges, checkForError, deepCopy} from './helpers';
import { MessageTemplate } from './interfaces'

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

// 'home' is active when no tab is selected
type Tabs = 'home' | 'broadcast' | 'messages' | 'dashboard';
type TabsInfoType = {
  home: {
    sidebarTitle: string,
  },
  broadcast: {
    sidebarTitle: string,
  },
  messages: {
    sidebarTitle: string,
  },
  dashboard: {
    sidebarTitle: string,
  }
}
const tabsInfo: TabsInfoType = {
  home: {
    sidebarTitle: '',
  },
  broadcast: {
    sidebarTitle: 'Create a Campaign',
  },
  messages: {
    sidebarTitle: 'Messages Title',
  },
  dashboard: {
    sidebarTitle: 'Dashboard Title',
  },
}

type TabProps = {
  tabName: string,
  displayName?: string,
  selected: boolean,
  select: (value: any) => void,
}
const Tab = ({
  tabName = '',
  displayName = '',
  selected = false,
  select,
}: TabProps) => {
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
  activeTab: Tabs,
  openTab: (name: Tabs) => void,
}
const Toolbar: React.FC<ToolbarProps> = ({
  activeTab,
  openTab,
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
            selected={false}
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
            selected={false}
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
            select={() => openTab("dashboard")}
          />
          <Tab
            tabName="messages"
            selected={activeTab === "messages"}
            select={() => openTab("messages")}
          />
          <Tab
            tabName="broadcast"
            selected={activeTab === "broadcast"}
            select={() => openTab("broadcast")}
          />
        </Box>
        <Tab
          tabName="settings"
          selected={false}
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

const defaultMessage: MessageTemplate = {
  name: 'Sample Message',
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
  message: string,
  updateBody: (message: string) => void,
}
const MessageBuilder = ({
  message,
  updateBody,
}: MessageBuilderProps) => {

  const [count, setCount] = useState(message.length);
  const [error, setError] = useState('');

  const updateMessageTemp = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    newValue = newValue.slice(0, CHAR_LIMIT);
    e.target.value = newValue;
    setCount(newValue.length);
    updateBody(newValue);
    // // TODO: implement variable validation
    const newError = checkForError(newValue);
    if (newError !== error) {
      setError(newError);
    }

    // const newMessage = deepCopy(message);
    // newMessage.body.messageTemp = newValue;
    // setMessage(newMessage);
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
        defaultValue={message}
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
          backgroundColor: 'white',
          color: 'black',
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

type MessageSection = 'header' | 'body' | 'footer' | 'buttons';
type MessageCardProps = {
  message: MessageTemplate,
  updateBody: (message: string) => void
  includeSection: (include: boolean) => void
  section: MessageSection,
}

const MessageCard = ({
  message,
  updateBody,
  includeSection,
  section,
}: MessageCardProps) => {
  let title: string;
  let icon: JSX.Element;
  const required = MESSAGE_LAYOUT[section].required;
  let body: JSX.Element = <></>;
  switch (section) {
    case String('body'):
      title = 'Body message'
      icon = <TextFieldsIcon
        sx={{color: grey[600]}}
      />
      body = <MessageBuilder 
        message={message.body.messageTemp}
        updateBody={updateBody}
      />
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
              includeSection(!message[section].includedTemp)
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
  saveMessage: () => void,
  revertMessage: () => void,
  removeMessage: () => void,
  updateBody: (message: string) => void,
  includeSection: (section: MessageSection, included: boolean) => void,
  // setMessage: (value: MessageTemplate) => void
  toggleSidebar: (open: boolean) => void
}
const Sidebar = ({
  message,
  visible,
  mobile,
  saveMessage,
  revertMessage,
  removeMessage,
  updateBody,
  includeSection,
  toggleSidebar,
}: SidebarProps) => {
  const hasChangesPending = checkPendingChanges(message);

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
              onClick={() => toggleSidebar(false)}
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
            updateBody={updateBody}
            includeSection={(include: boolean) => includeSection('header', include)}
            section="header"
          />
          <MessageCard
            message={message}
            updateBody={updateBody}
            includeSection={(include: boolean) => includeSection('body', include)}
            section="body"
          />
          <MessageCard
            message={message}
            updateBody={updateBody}
            includeSection={(include: boolean) => includeSection('footer', include)}
            section="footer"
          />
          <MessageCard
            message={message}
            updateBody={updateBody}
            includeSection={(include: boolean) => includeSection('buttons', include)}
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
          onClick={hasChangesPending ? revertMessage : removeMessage}
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
type MessageProps = {
  message: MessageTemplate,
  showSidebar: () => void,
}
const Message = ({
  message,
  showSidebar,
}: MessageProps) => {
  const hasChangesPending = checkPendingChanges(message);
  console.log('MESSAGE', message)
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
type CanvasProps = {
  message: MessageTemplate,
  showSidebar: () => void,
}
const Canvas = ({
  message,
  showSidebar,
}: CanvasProps) => {
  console.log('render canvas')
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
      <Message message={message} showSidebar={showSidebar}
      />
    </Box>
  )
}

// DEFINE STATE
const defaultMessageList: MessageTemplate[] = [defaultMessage];
type AppState = {
  activeTab: Tabs, 
  messages: MessageTemplate[],
  sidebarOpen: boolean,
  activeMessage: number,
}
const initialState: AppState = {
  activeTab: 'broadcast',
  activeMessage: 0,
  sidebarOpen: true,
  messages: defaultMessageList,
}

// ACTIONS
type OpenMessageAction = {
  type: 'OPEN_MESSAGE',
  payload: {
    index: number,
  }
}
type OpenTabAction = {
  type: 'OPEN_TAB',
  payload: { 
    name: Tabs,
  }
}
type AddMessageAction = {
  type: 'ADD_MESSAGE',
}
type RemoveMessageAction = {
  type: 'REMOVE_MESSAGE',
}
type UpdateBodyAction = {
  type: 'UPDATE_BDDY',
  payload: {
    message: string,
    // parameters: string[],
  },
}
type IncludeSectionAction = {
  type: 'INCLUDE_SECTION',
  payload: {
    include: boolean,
    section: MessageSection,
  }
}
type SaveMessageAction = {
  type: 'SAVE_MESSAGE',
}
type RevertMessageAction = {
  type: 'REVERT_MESSAGE',
}
type ToggleSidebarAction = {
  type: 'TOGGLE_SIDEBAR',
  payload: {
    open: boolean,
  }
}
// TODO actions to implement
// const updateHeaderAction = 'UPDATE_HEADER'
// const addBodyVariable = 'ADD_BODY_VARIABLE'
// const updateFooterAction = 'UPDATE_FOOTER'
// const addButtonAction = 'ADD_BUTTON'
// const removeButtonAction = 'REMOVE_BUTTON'
// const updateButtonAction = 'UPDATE_BUTTON'
// const hideSectionHelp = 'INCLUDE_SECTION'
// const updateNameAction = 'UPDATE_NAME'

type Action = 
  OpenMessageAction |
  OpenTabAction |
  AddMessageAction |
  RemoveMessageAction |
  UpdateBodyAction |
  IncludeSectionAction |
  ToggleSidebarAction |
  SaveMessageAction |
  RevertMessageAction;

type ActionType = {
  type: string,
  payload?: any,
}

function appReducer(state = initialState, action: ActionType) {
  let newMessage;
  let newMessages;
  switch (action.type) {
    case 'OPEN_TAB':
      return {
        ...state,
        activeTab: action.payload.name,
      }
    case 'OPEN_MESSAGE':
      return {
        ...state,
        activeMessage: action.payload.index,
      }
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.payload.open,
      }
    case 'ADD_MESSAGE':
      newMessage = deepCopy(defaultMessage);
      newMessage.name = `Sample Message ${state.messages.length + 1}`
      return {
        ...state,
        messages: [...state.messages, newMessage],
      }
      return state;
    case 'REMOVE_MESSAGE':
      newMessages = state.messages.filter((m, i) => i !== state.activeMessage);
      return {
        ...state,
        messages: newMessages,
      }
    case 'UPDATE_BODY':
      newMessages = state.messages.map((m, i) => {
        if (i === state.activeMessage) {
          newMessage = deepCopy(m);
          newMessage.body.messageTemp = action.payload.message;
          return newMessage
        }
        return m
      });
      return {
        ...state,
        messages: newMessages,
      }
    case 'INCLUDE_SECTION':
      console.log('INCLUDE SECTION!', action.payload)
      newMessages = state.messages.map((m, i) => {
        if (i === state.activeMessage) {
          newMessage = deepCopy(m);
          newMessage[action.payload.section].includedTemp = action.payload.included;
          return newMessage
        }
        return m
      });
      return {
        ...state,
        messages: newMessages,
      };
    case 'SAVE_MESSGE':
      newMessages = state.messages.map((m, i) => {
        if (i === state.activeMessage) {
          newMessage = deepCopy(m);
          newMessage.header.included = newMessage.header.includedTemp;
          newMessage.body.included = newMessage.body.includedTemp;
          newMessage.body.message = newMessage.body.messageTemp;
          newMessage.footer.included = newMessage.footer.includedTemp;
          newMessage.buttons.included = newMessage.buttons.includedTemp;
          return newMessage
        }
        return m
      });
      return {
        ...state,
        messages: newMessages,
      };
    case 'REVERT_MESSAGE':
      newMessages = state.messages.map((m, i) => {
        if (i === state.activeMessage) {
          newMessage = deepCopy(m);
          newMessage.header.includedTemp = newMessage.header.included;
          newMessage.body.includedTemp = newMessage.body.included;
          newMessage.body.messageTemp = newMessage.body.message;
          newMessage.footer.includedTemp = newMessage.footer.included;
          newMessage.buttons.includedTemp = newMessage.buttons.included;
          return newMessage
        }
        return m
      });
      return {
        ...state,
        messages: newMessages,
      }
    default:
      return state;
  }
}

// SELECTORS
const selectSidebarTitle = (activeTab: Tabs): string => {
  return tabsInfo[activeTab].sidebarTitle;
}
export default function Home() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  // if (typeof window !== undefined) {
  //   window.state = state;
  // }
  const mobile = useMediaQuery('(max-width:599px)');
  const activeTab: Tabs = state.activeTab;
  const sidebarTitle = useMemo(() => selectSidebarTitle(activeTab), [activeTab]);
  const activeMessage = state.messages[state.activeMessage];
  console.log('HOME', state)

  return (
    <main className={styles.main}>
      <Toolbar
        activeTab={state.activeTab}
        openTab={(name) => {
          dispatch({
            type: 'OPEN_TAB',
            payload: {name}
          });
        }}
      />
      <Header
        title={sidebarTitle}
        close={() => {
          const action: OpenTabAction = {
            type: 'OPEN_TAB',
            payload: {name: 'home'}
          }
          dispatch(action)
        }}
        visible={!!sidebarTitle}
        showTips={() => console.log('SHOW TIPS')}
      />
      <Sidebar
        message={activeMessage}
        visible={activeTab === 'broadcast' && state.sidebarOpen}
        mobile={mobile}
        saveMessage={() => {
          dispatch({type: 'SAVE_MESSAGE'})
        }}
        revertMessage={() => {
          dispatch({type: 'REVERT_MESSAGE'})
        }}
        removeMessage={() => {
          dispatch({type: 'REMOVE_MESSAGE'})
        }}
        updateBody={(message: string) => {
          dispatch({
            type: 'UPDATE_BODY',
            payload: {
              message,
            }
          });
        }}
        includeSection={(section: MessageSection , included: boolean) => {
          dispatch({
            type: 'INCLUDE_SECTION',
            payload: {
              section,
              included,
            }
          });
        }}
        // setMessage={setTemplate}
        toggleSidebar={(open: boolean) => {
          dispatch({
            type: 'TOGGLE_SIDEBAR',
            payload: {open},
          });
        }}
      />
      {(!mobile || !state.sidebarOpen) &&
      <Canvas
        key={String(activeMessage)}
        message={activeMessage}
        showSidebar={() => {
          dispatch({
            type: 'TOGGLE_SIDEBAR',
            payload: {open: true},
          });
        }}
      />}
    </main>
  )
}
