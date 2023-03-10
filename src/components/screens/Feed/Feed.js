import React, { useRef, useCallback } from 'react'
import { FlatList, View, ActivityIndicator, Dimensions } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { Viewport } from '@skele/components'
import FeedItem from '../../FeedItem/FeedItem'
import PropTypes from 'prop-types'
import dynamicStyles from './styles'
import IMCameraModal from '../../../Core/camera/IMCameraModal'
import TNMediaViewerModal from '../../../Core/truly-native/TNMediaViewerModal'
import FullStories from '../../../Core/stories/FullStories'
import { TNEmptyStateView } from '../../../Core/truly-native'
import MediaComposer from '../../../instagram-composer'
import { useConfig } from '../../../config'

const HEIGHT = Dimensions.get('window').height

function Feed(props) {
  const {
    onCommentPress,
    feed,
    user,
    isCameraOpen,
    onCameraClose,
    onUserItemPress,
    displayStories,
    onFeedUserItemPress,
    isMediaViewerOpen,
    feedItems,
    onMediaClose,
    onMediaPress,
    selectedMediaIndex,
    stories,
    onPostStory,
    userStories,
    onReaction,
    onLikeReaction,
    onOtherReaction,
    loading,
    handleOnEndReached,
    isFetching,
    isStoryUpdating,
    onSharePost,
    onDeletePost,
    onUserReport,
    onFeedScroll,
    willBlur,
    selectedFeedIndex,
    shouldReSizeMedia,
    feedRef,
    onEmptyStatePress,
    navigation,
    isMediaComposerVisible,
    onMediaComposerDismiss,
    onShareMediaPost,
  } = props

  const config = useConfig()
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const fullStoryRef = useRef()
  const mediaLayouts = useRef([])

  const onImagePost = source => {
    onPostStory(source)

    // fullStoryRef.current.postStory(story);
    // console.log(source);
  }

  const getItemLayout = (data, index) => ({
    length: feed.length,
    offset: HEIGHT * 0.55 * index,
    index,
  })

  const onTextFieldUserPress = () => {}

  const onTextFieldHashTagPress = hashtag => {
    navigation.push('FeedSearch', { hashtag })
  }

  const renderItem = ({ item, index }) => {
    const isLastItem = index === feed?.length - 1
    let shouldUpdate = false
    if (item.shouldUpdate) {
      shouldUpdate = item.shouldUpdate
    }
    return (
      <FeedItem
        key={index + ''}
        onUserItemPress={onFeedUserItemPress}
        item={item}
        isLastItem={isLastItem}
        feedIndex={index}
        onCommentPress={onCommentPress}
        onMediaPress={onMediaPress}
        shouldReSizeMedia={shouldReSizeMedia}
        onReaction={onReaction}
        onLikeReaction={onLikeReaction}
        onOtherReaction={onOtherReaction}
        iReact={item.iReact}
        shouldUpdate={shouldUpdate}
        userReactions={item.userReactions}
        onSharePost={onSharePost}
        onDeletePost={onDeletePost}
        onUserReport={onUserReport}
        user={user}
        willBlur={willBlur}
        shouldDisplayViewAllComments={true}
        onLayout={event => {
          const layout = event.nativeEvent.layout
          mediaLayouts.current[index] = layout.x
        }}
        onTextFieldUserPress={onTextFieldUserPress}
        onTextFieldHashTagPress={onTextFieldHashTagPress}
      />
    )
  }

  const renderListHeader = useCallback(() => {
    return (
      <FullStories
        ref={fullStoryRef}
        user={user}
        isStoryUpdating={isStoryUpdating}
        onUserItemPress={onUserItemPress}
        stories={stories}
        userStories={userStories}
      />
    )
  }, [stories, userStories])

  const renderListFooter = () => {
    if (isFetching) {
      return <ActivityIndicator style={{ marginVertical: 7 }} size="small" />
    }
    return null
  }

  const renderEmptyComponent = () => {
    if (!feed) {
      return null
    }
    const emptyStateConfig = {
      title: localized('Welcome'),
      description: localized(
        'Go ahead and follow a few friends. Their posts will show up here.',
      ),
      buttonName: localized('Find Friends'),
      onPress: onEmptyStatePress,
    }

    return (
      <TNEmptyStateView
        style={styles.emptyStateView}
        emptyStateConfig={emptyStateConfig}
      />
    )
  }

  if (loading) {
    return (
      <View style={styles.feedContainer}>
        <ActivityIndicator style={{ marginTop: 15 }} size="small" />
      </View>
    )
  }

  return (
    <View style={styles.feedContainer}>
      <Viewport.Tracker>
        <FlatList
          ref={ref => {
            if (feedRef) {
              feedRef.current = ref
            }
          }}
          scrollEventThrottle={16}
          onScroll={onFeedScroll}
          showsVerticalScrollIndicator={false}
          getItemLayout={getItemLayout}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderListFooter}
          ListEmptyComponent={renderEmptyComponent}
          data={feed}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.5}
          onEndReached={handleOnEndReached}
        />
      </Viewport.Tracker>
      <IMCameraModal
        isCameraOpen={isCameraOpen}
        maxDuration={config.videoMaxDuration}
        onImagePost={onImagePost}
        onCameraClose={onCameraClose}
      />
      <TNMediaViewerModal
        mediaItems={feedItems}
        isModalOpen={isMediaViewerOpen}
        onClosed={onMediaClose}
        selectedMediaIndex={selectedMediaIndex}
      />
      <MediaComposer
        visible={isMediaComposerVisible}
        onDismiss={onMediaComposerDismiss}
        onSharePost={onShareMediaPost}
        navigation={navigation}
      />
    </View>
  )
  // }
}

Feed.propTypes = {
  feedItems: PropTypes.array,
  userStories: PropTypes.object,
  stories: PropTypes.array,
  onMediaClose: PropTypes.func,
  onCommentPress: PropTypes.func,
  onPostStory: PropTypes.func,
  onUserItemPress: PropTypes.func,
  onCameraClose: PropTypes.func,
  isCameraOpen: PropTypes.bool,
  displayStories: PropTypes.bool,
  isMediaViewerOpen: PropTypes.bool,
  onFeedUserItemPress: PropTypes.func,
  onMediaPress: PropTypes.func,
  selectedMediaIndex: PropTypes.number,
  onLikeReaction: PropTypes.func,
  onOtherReaction: PropTypes.func,
}

export default Feed
