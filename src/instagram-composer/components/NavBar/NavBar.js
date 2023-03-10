import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

export default function NavBar(props) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { nextTitle, mainTitle, prevTitle, onNext, onPrev, disabled } = props
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPrev}
        activeOpacity={0.8}
        style={[styles.leftContainer, styles.textContainer]}>
        <Text style={styles.text}>{prevTitle}</Text>
      </TouchableOpacity>
      <View style={[styles.titleContainer, styles.textContainer]}>
        <Text style={styles.text}>{mainTitle}</Text>
      </View>
      <TouchableOpacity
        onPress={onNext}
        activeOpacity={0.8}
        disabled={disabled}
        style={[styles.rightContainer, styles.textContainer]}>
        {!disabled && (
          <Text style={[styles.text, styles.nextText]}>{nextTitle}</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}
