/*
 * Copyright (C) 2019 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import FriendlyDatetime from '../../../../../../shared/FriendlyDatetime'
import {func, object, shape, string} from 'prop-types'
import I18n from 'i18n!assignments_2'
import React from 'react'

import {Flex} from '@instructure/ui-layout'
import {
  IconCheckMarkIndeterminateLine,
  IconFolderLine,
  IconPublishSolid,
  IconUnpublishedLine
} from '@instructure/ui-icons'
import {ScreenReaderContent} from '@instructure/ui-a11y'
import {Text, TruncateText} from '@instructure/ui-elements'
import {Tooltip} from '@instructure/ui-overlays'

const FolderButton = props => {
  return (
    <Tooltip tip={props.tip} as="div" variant="inverse">
      <div
        className="file-select-item"
        onClick={() => props.handleFolderSelect(props.folderID)}
        onKeyUp={e => {
          // Keycode 13 is the Return or Enter key
          if (e.keyCode === 13) {
            props.handleFolderSelect(props.folderID)
          }
        }}
        tabIndex="0"
        role="button"
      >
        {props.children}
      </div>
    </Tooltip>
  )
}

const renderFolderName = (folderName, altSRText) => (
  <Text size="small">
    <ScreenReaderContent>{altSRText || I18n.t(', name: ')}</ScreenReaderContent>
    <TruncateText>
      <div aria-hidden={!!altSRText}>{folderName}</div>
    </TruncateText>
  </Text>
)

const renderCreatedAt = createdAt => (
  <Text size="small">
    <ScreenReaderContent>{I18n.t(', date created: ')}</ScreenReaderContent>
    <FriendlyDatetime dateTime={createdAt} format={I18n.t('#date.formats.medium')} />
  </Text>
)

const renderPublishedIcon = locked => {
  return locked ? (
    <>
      <ScreenReaderContent>{I18n.t(', state: unpublished')}</ScreenReaderContent>
      <IconUnpublishedLine />
    </>
  ) : (
    <>
      <ScreenReaderContent>{I18n.t(', state: published')}</ScreenReaderContent>
      <IconPublishSolid color="success" />
    </>
  )
}

const renderParentFolder = (folder, handleFolderSelect, columnWidths) => {
  if (folder.parent_folder_id !== null && folder.parent_folder_id !== undefined) {
    return (
      <FolderButton
        folderID={folder.parent_folder_id.toString()}
        handleFolderSelect={handleFolderSelect}
        tip="../"
      >
        <ScreenReaderContent>{I18n.t('type: folder')}</ScreenReaderContent>
        <Flex>
          <Flex.Item padding="xx-small" size={columnWidths.thumbnailWidth}>
            <IconFolderLine size="small" />
          </Flex.Item>
          <Flex.Item padding="xx-small" size={columnWidths.nameWidth} grow>
            {renderFolderName('../', I18n.t(', name: parent directory '))}
          </Flex.Item>
          <Flex.Item padding="xx-small" size={columnWidths.dateCreatedWidth}>
            <IconCheckMarkIndeterminateLine />
          </Flex.Item>
          <Flex.Item padding="xx-small" size={columnWidths.dateModifiedWidth}>
            <IconCheckMarkIndeterminateLine />
          </Flex.Item>
          <Flex.Item padding="xx-small" size={columnWidths.modifiedByWidth}>
            <IconCheckMarkIndeterminateLine />
          </Flex.Item>
          <Flex.Item padding="xx-small" size={columnWidths.fileSizeWidth}>
            <IconCheckMarkIndeterminateLine />
          </Flex.Item>
          <Flex.Item padding="xx-small" size={columnWidths.publishedWidth}>
            <IconCheckMarkIndeterminateLine />
          </Flex.Item>
        </Flex>
      </FolderButton>
    )
  }
}

const TableFolders = props => {
  return (
    <>
      {renderParentFolder(
        props.folders[props.selectedFolderID],
        props.handleFolderSelect,
        props.columnWidths
      )}
      {props.folders[props.selectedFolderID].subFolderIDs.map(id => {
        const folder = props.folders[id]
        return (
          <FolderButton
            key={folder.id}
            folderID={folder.id}
            handleFolderSelect={props.handleFolderSelect}
            tip={folder.name}
          >
            <ScreenReaderContent>{I18n.t('type: folder')}</ScreenReaderContent>
            <Flex>
              <Flex.Item padding="xx-small" size={props.columnWidths.thumbnailWidth}>
                <IconFolderLine size="small" />
              </Flex.Item>
              <Flex.Item padding="xx-small" size={props.columnWidths.nameWidth} grow>
                {renderFolderName(folder.name)}
              </Flex.Item>
              <Flex.Item padding="xx-small" size={props.columnWidths.dateCreatedWidth}>
                {renderCreatedAt(folder.created_at)}
              </Flex.Item>
              <Flex.Item padding="xx-small" size={props.columnWidths.dateModifiedWidth}>
                <IconCheckMarkIndeterminateLine />
              </Flex.Item>
              <Flex.Item padding="xx-small" size={props.columnWidths.modifiedByWidth}>
                <IconCheckMarkIndeterminateLine />
              </Flex.Item>
              <Flex.Item padding="xx-small" size={props.columnWidths.fileSizeWidth}>
                <IconCheckMarkIndeterminateLine />
              </Flex.Item>
              <Flex.Item padding="xx-small" size={props.columnWidths.publishedWidth}>
                {renderPublishedIcon(folder.locked)}
              </Flex.Item>
            </Flex>
          </FolderButton>
        )
      })}
    </>
  )
}

TableFolders.propTypes = {
  columnWidths: shape({
    thumbnailWidth: string,
    nameWidth: string,
    nameAndThumbnailWidth: string,
    dateCreatedWidth: string,
    dateModifiedWidth: string,
    modifiedByWidth: string,
    fileSizeWidth: string,
    publishedWidth: string
  }),
  // eslint-disable-next-line react/forbid-prop-types
  folders: object,
  handleFolderSelect: func,
  selectedFolderID: string
}

export default TableFolders
