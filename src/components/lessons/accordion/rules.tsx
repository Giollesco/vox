import { Text, View } from '@/ui';
import { hasParents } from '@ronradtke/react-native-markdown-display';
import { Platform, StyleSheet } from 'react-native';

// Here for more info: https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js
export const rules = {
  paragraph: (node: any, children: any, parent: any, styles: any) => (
    <Text
      key={node.key}
      className="text-md"
      style={[styles.paragraph, { lineHeight: 26 }]}
    >
      {children}
    </Text>
  ),
  bullet_list: (node: any, children: any, parent: any, styles: any) => (
    <Text
      key={node.key}
      className="text-md"
      style={[styles.bullet_list, { lineHeight: 26 }]}
    >
      {children}
    </Text>
  ),
  ordered_list: (node: any, children: any, parent: any, styles: any) => (
    <View key={node.key} style={styles._VIEW_SAFE_ordered_list}>
      {children}
    </View>
  ),
  heading1: (node: any, children: any, parent: any, styles: any) => (
    <Text
      key={node.key}
      className="text-3xl"
      style={[styles.heading, styles.heading1, { marginVertical: 16 }]}
    >
      {children}
    </Text>
  ),
  heading2: (node: any, children: any, parent: any, styles: any) => (
    <Text
      key={node.key}
      className="text-xl"
      style={[styles.heading, styles.heading2, { marginVertical: 16 }]}
    >
      {children}
    </Text>
  ),
  heading3: (node: any, children: any, parent: any, styles: any) => (
    <Text
      key={node.key}
      className="text-lg"
      style={[styles.heading, styles.heading3, { marginVertical: 16 }]}
    >
      {children}
    </Text>
  ),
  // Emphasis
  strong: (node: any, children: any, parent: any, styles: any) => (
    <Text key={node.key} style={styles.strong} weight="bold">
      {children}
    </Text>
  ),
  em: (node: any, children: any, parent: any, styles: any) => (
    <Text key={node.key} style={styles.em}>
      {children}
    </Text>
  ),
  s: (node: any, children: any, parent: any, styles: any) => (
    <Text key={node.key} style={styles.s} weight="regularItalic">
      {children}
    </Text>
  ),
  // this is a unique and quite annoying render rule because it has
  // child items that can be styled (the list icon and the list content)
  // outside of the AST tree so there are some work arounds in the
  // AST renderer specifically to get the styling right here
  list_item: (
    node: any,
    children: any,
    parent: any,
    styles: any,
    inheritedStyles = {}
  ) => {
    // we need to grab any text specific stuff here that is applied on the list_item style
    // and apply it onto bullet_list_icon. the AST renderer has some workaround code to make
    // the content classes apply correctly to the child AST tree items as well
    // as code that forces the creation of the inheritedStyles object for list_items
    const refStyle = {
      ...inheritedStyles,
      ...StyleSheet.flatten(styles.list_item),
    };

    const arr = Object.keys(refStyle);

    const modifiedInheritedStylesObj = {};
    let textStyleProps = [
      'textShadowOffset',
      'color',
      'fontSize',
      'fontStyle',
      'fontWeight',
      'lineHeight',
      'textAlign',
      'textDecorationLine',
      'textShadowColor',
      'fontFamily',
      'textShadowRadius',
      'includeFontPadding',
      'textAlignVertical',
      'fontVariant',
      'letterSpacing',
      'textDecorationColor',
      'textDecorationStyle',
      'textTransform',
      'writingDirection',
    ];

    for (let b = 0; b < arr.length; b++) {
      if (textStyleProps?.includes(arr[b])) {
        // @ts-ignore
        modifiedInheritedStylesObj[arr[b]] = refStyle[arr[b]];
      }
    }

    if (hasParents(parent, 'bullet_list')) {
      return (
        <View key={node.key} style={[styles._VIEW_SAFE_list_item]}>
          <Text
            style={[modifiedInheritedStylesObj, styles.bullet_list_icon]}
            accessible={false}
          >
            {Platform.select({
              android: '\u2022',
              ios: '\u00B7',
              default: '\u2022',
            })}
          </Text>
          <View style={styles._VIEW_SAFE_bullet_list_content}>{children}</View>
        </View>
      );
    }

    if (hasParents(parent, 'ordered_list')) {
      const orderedListIndex = parent.findIndex(
        (el: any) => el.type === 'ordered_list'
      );

      const orderedList = parent[orderedListIndex];
      let listItemNumber;

      if (orderedList.attributes && orderedList.attributes.start) {
        listItemNumber = orderedList.attributes.start + node.index;
      } else {
        listItemNumber = node.index + 1;
      }

      return (
        <View key={node.key} style={[styles._VIEW_SAFE_list_item]}>
          <Text style={[modifiedInheritedStylesObj, styles.ordered_list_icon]}>
            {listItemNumber}
            {node.markup}
          </Text>
          <Text
            style={[styles._VIEW_SAFE_ordered_list_content, { lineHeight: 26 }]}
            className="text-md"
          >
            {children}
          </Text>
        </View>
      );
    }

    // we should not need this, but just in case
    return (
      <View key={node.key} style={styles._VIEW_SAFE_list_item}>
        {children}
      </View>
    );
  },
};
