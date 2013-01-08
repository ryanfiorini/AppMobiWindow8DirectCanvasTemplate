using appMobiWebViewWindows8;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

namespace AppMobiWindows8DirectCanvasTemplate
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class AppMobiPage : Page
    {
        public appMobiWebView amWebView;

        public AppMobiPage()
        {
            this.InitializeComponent();

            amWebView = new appMobiWebView(webView, appMobiPage, new Uri("ms-appx-web:///html/index.html"));

            // Implement splash screen handler
            amWebView.HideSplashScreen += amWebView_HideSplashScreen;
        }

        void amWebView_HideSplashScreen(object sender, EventArgs e)
        {
            webView.Visibility = Windows.UI.Xaml.Visibility.Visible;
            LayoutRoot.Children.Remove(this.SplashScreen);
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.  The Parameter
        /// property is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
        }
    }
}
