const fs = require('fs')
const path = require('path')
const marked = require('meta-marked')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const srcPath = path.join(__dirname, 'src') + path.sep
const outputPath = path.join(__dirname, 'build') + path.sep
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const entries = widgetWebpack.getDefaultEntries()
const copy = widgetWebpack.getDefaultCopyList()

entries['guides/guideStyles.css'] = [srcPath+'_helper-docs/guideStyles.scss']

const customCopy = copy.concat([
	{
		from: `${srcPath}/_helper-docs/assets`,
		to: `${outputPath}/guides/assets`,
		toType: 'dir'
	}
])


//options for the build
const options = {
	copyList: customCopy,
	entries: entries
}

const generateHelperPlugin = name => {
	const file = fs.readFileSync(path.join(__dirname, 'src', '_helper-docs', name+'.md'), 'utf8')
	const content = marked(file)

	return new HtmlWebpackPlugin({
		template: path.join(__dirname, 'src', '_helper-docs', 'helperTemplate'),
		filename: path.join(outputPath, 'guides', name+'.html'),
		title: name.charAt(0).toUpperCase() + name.slice(1),
		chunks:['guides'],
		content: content.html
	})
}

let buildConfig = widgetWebpack.getLegacyWidgetBuildConfig(options)

buildConfig.plugins.unshift(generateHelperPlugin('creator'))
buildConfig.plugins.unshift(generateHelperPlugin('player'))

module.exports = buildConfig

//module.exports = require('materia-widget-development-kit/webpack-widget').getLegacyWidgetBuildConfig()
